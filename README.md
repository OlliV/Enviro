Enviro
======

A software stack for air quality measurements.

BOM
---

- 1x Adafruit SGP30 Air Quality Sensor Breakout - VOC and eCO2
- 1x Pibow Zero Case for Raspberry Pi Zero version 1.3
- 1x Official Raspberry Pi Universal Power Supply (Pi 3 & Zero Only)
- 1x Raspberry Pi Zero WH (pre-soldered)
- 1x PMS5003 Particulate Matter Sensor with Cable
- 1x Enviro+ for Raspberry Pi

You'll also need a SharePoint Online license because OAuth 2.0 Device Flow
that is used by the data collector program is not supported on consumer plans.

Enviro Collector
----------------

Install enviroplus Python libraries, Node.js, and utils:

```bash
git clone https://github.com/pimoroni/enviroplus-python
cd enviroplus-python
sudo ./install.sh
pip install spidev
pip install requests
curl -LO https://unofficial-builds.nodejs.org/download/release/v12.14.1/node-v12.14.1-linux-armv6l.tar.gz
tar xf node-v12.14.1-linux-armv6l.tar.gz
echo 'export PATH=$PATH:/home/pi/node-v12.14.1-linux-armv6l/bin' >> ~/.bashrc
sudo reboot
```

Create a `config.json` file:

```
{
  "tenant": "YOU.onmicrosoft.com",
  "authorityHostUrl": "https://login.microsoftonline.com",
  "clientId": "00000000-0000-0000-0000-00000000000"
}
```

Copy the data collector to the RPi:

```
$ rsync -r --exclude node_modules ./ pi@192.168.43.30:./device
```

Finally run the program on your RPi:

```
$ node index.js
Use a web browser to open the page https://microsoft.com/devicelogin and enter the code XXXYYYY to sign in
...
Authenticated as user@YOU.onmicrosoft.com
Processed 30 samples
Processed 29 samples
```
