Enviro
======

A software stack for air quality measurements.

![Photo](/photo.png)
![Screenshot](/screenshot.png)

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

The data will be stored under an App folder called `Enviro` and in there,
by default, under a hard coded folder named `home`. The folder is configured
in the following files:

- `device/index.js`
- `web/lib/get-series.js`

AAD Configuration
-----------------

First of all you need to register an AAD app. The app is very simple, you'll
need to create it as a Web app add the redirect URIs and configure permissions
in the *API permissions* tab as requested in `web/lib/auth-provider-factory.js`.

In theory the web and AAD app could be shared globally between users, but since
we already need an SPO subscription for Enviro there is no real reason to do
it that way.

If you already messed up something and lost track of the correct pane/tab,
the following settings are located under the *Authentication* tab.

The redirect URIs should be the ones of where your app will be located in.
First of all you'll probably want to add `http://localhost:3000` for local
development. The production URI must be behind TLS, so it could be something
like `https://enviro.mycooldomain.com`.

Then you'll need to setup implicit grant, as this is a sort of an SPA with no
backend server. So enable the following settings:

- *Access tokens*
- *ID tokens*

*Supported account types* setting can be left as is.

You might need to mark the *Default client type* as a public client in the
last setting on the *Authentication* tab, as the OAuth Device code flow will
probably only work in that mode.

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

Enviro Web
----------

The authentication is currently configured in `web/lib/auth-provider-factory.js`
and the path is configured in `web/lib/get-series.js`.
