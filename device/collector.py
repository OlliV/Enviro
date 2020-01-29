#!/usr/bin/env python

# MIT License
#
# Copyright (c) 2018 Pimoroni Ltd.
# Copyright (c) 2020 Olli Vanhoja <olli.vanhoja@alumni.helsinki.fi>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import requests
import time
from bme280 import BME280
from pms5003 import PMS5003, ReadTimeoutError

try:
    from smbus2 import SMBus
except ImportError:
    from smbus import SMBus

bus = SMBus(1)

# Create BME280 instance
bme280 = BME280(i2c_dev=bus)

# Create PMS5003 instance
pms5003 = PMS5003()

# Read values from BME280 and PMS5003 and return as dict
def read_values():
    values = {}
    cpu_temp = get_cpu_temperature()
    raw_temp = bme280.get_temperature()
    comp_temp = raw_temp - ((cpu_temp - raw_temp) / comp_factor)
    values["temperature"] = "{:.2f}".format(comp_temp)
    values["pressure"] = "{:.2f}".format(bme280.get_pressure() * 100)
    values["humidity"] = "{:.2f}".format(bme280.get_humidity())
    try:
        pm_values = pms5003.read()
        values["P1_0"] = str(pm_values.pm_ug_per_m3(1.0))
        values["P2_5"] = str(pm_values.pm_ug_per_m3(2.5))
        values["P10"] = str(pm_values.pm_ug_per_m3(10))
    except ReadTimeoutError:
        pms5003.reset()
        pm_values = pms5003.read()
        values["P1_0"] = str(pm_values.pm_ug_per_m3(1.0))
        values["P2_5"] = str(pm_values.pm_ug_per_m3(2.5))
        values["P10"] = str(pm_values.pm_ug_per_m3(10))
    return values


# Get CPU temperature to use for compensation
def get_cpu_temperature():
    with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
        temp = f.read()
        temp = int(temp) / 1000.0
    return temp


# Get Raspberry Pi serial number to use as ID
def get_serial_number():
    with open('/proc/cpuinfo', 'r') as f:
        for line in f:
            if line[0:6] == 'Serial':
                return line.split(":")[1].strip()

def send_to_parent(values, id):
    pm_values = dict(i for i in values.items() if i[0].startswith("P"))
    temp_values = dict(i for i in values.items() if not i[0].startswith("P"))

    resp = requests.post("http://127.0.0.1:3000",
           json={ "pmValues": pm_values, "tempValues": temp_values },
           headers={
               "X-Sensor": id,
               "Content-Type": "application/json"
           }
    )

    if resp.ok:
        return True
    else:
        return False

# Compensation factor for temperature
comp_factor = 1.2

# Raspberry Pi ID to send to Luftdaten
id = "raspi-" + get_serial_number()

# Main loop to read data, display, and send to Luftdaten
while True:
    try:
        values = read_values()
        resp = send_to_parent(values, id)
	time.sleep(1.0)
    except Exception as e:
        print(e)
