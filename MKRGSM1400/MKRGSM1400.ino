/*
  script for Arduino MKR GSM 1400
  receives sensor data (via Serial1 port) and publishes to MQTT broker (shiftr.io)

  references:
  - https://github.com/256dpi/arduino-mqtt/tree/master/examples/ArduinoMKRGSM1400 (MQTT interfacing)
  - https://www.programmingelectronics.com/serial-read/ (non blocking serial)
*/

#include <MKRGSM.h> // https://www.arduino.cc/en/Reference/MKRGSM
#include <MQTT.h> // https://github.com/256dpi/arduino-mqtt

#include "secrets.h" // import sensitive data

// read from secrets.h
const char pin[]      = PIN;
const char apn[]      = APN;
const char login[]    = LOGIN;
const char password[] = PASSWORD;

// MQTT and GSM
const char mqttClientId[] = MQTT_CLIENT_ID;
const char mqttUsername[] = MQTT_USERNAME;
const char mqttPassword[] = MQTT_PASSWORD;

GSMClient net;
GPRS gprs;
GSM gsmAccess;
MQTTClient client;

const unsigned int serialMessageLen = 64;

void connect() {

  bool connected = false; // connection state

  // attach to the GPRS network
  while (!connected) {

    if ((gsmAccess.begin(pin) == GSM_READY) && (gprs.attachGPRS(apn, login, password) == GPRS_READY)) {

      connected = true;

    } else {

      delay(1000);

    }

  }

  while (!client.connect(mqttClientId, mqttUsername, mqttPassword)) {

    delay(1000);

  }

  digitalWrite(LED_BUILTIN, HIGH); // connection to GRPS and MQTT broker successful

}

void readSerial() {
  // non-blocking serial read function

  // check to see if anything is available in the serial receive buffer
  while (Serial1.available() > 0) {

    // create a place to hold the incoming message
    static char serialMessage[serialMessageLen]; // serial message array
    static unsigned int bufferPos = 0;

    // read the next available byte in the serial receive buffer
    char inByte = Serial1.read();

    // message coming in (check not terminating character) and guard for over message size
    if (inByte != '\n' && (bufferPos < serialMessageLen - 1)) {

      serialMessage[bufferPos] = inByte;
      bufferPos++;

    } else { // full message recieved

      serialMessage[bufferPos] = '\0'; // add null character to string
      client.publish("/sensors", serialMessage); // callback for end of message (publish data)

      // reset for the next message
      bufferPos = 0; //add null character to string

    }

  }

}

void setup() {

  Serial1.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT); // indicate successful network connection

  client.begin("de4-siot.cloud.shiftr.io", net);

  connect();

}

void loop() {

  client.loop();

  if (!client.connected()) {
    connect();
  }

  readSerial();

}
