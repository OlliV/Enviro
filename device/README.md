Enviro Collector
================

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

Copy the data collector to the RPi:

```bash
rsync -r --exclude node_modules ./ pi@192.168.43.30:./device
```
