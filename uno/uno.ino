/*
  script for Arduino Uno
  polls readings from PM and GPS sensor and periodically transmits to MKR GSM 1400

  references:
  - https://github.com/mikalhart/TinyGPS/tree/master/examples/simple_test (TinyGPS library)
  - https://github.com/fu-hsi/PMS/tree/master/examples/Basic (PMS library)
  - https://www.instructables.com/Arduino-Timer-Interrupts/ (timer interrupts)
*/

#include <TinyGPS.h> // https://github.com/mikalhart/TinyGPS
#include <PMS.h> // https://github.com/fu-hsi/PMS
#include <AltSoftSerial.h> // https://github.com/PaulStoffregen/AltSoftSerial
#include <SoftwareSerial.h> // https://www.arduino.cc/en/Reference/softwareSerial

AltSoftSerial gpsSerial; // NEO-6M GPS serial (rx 8, tx 9)
SoftwareSerial pmsSerial(6, 7); // PMS5003 serial (rx, tx)

// GPS
float lat, lon;
TinyGPS gps; // create gps object

// PM sensor
PMS pms(pmsSerial);
PMS::DATA data;

// interrupt
volatile int intInc = 0;
int intFreq = 62; // minimum allowable frequency on TIMER0
float targetIntFreq = 0.4; // desired interrupt frequency (Hz)
int intThreshold = intFreq / targetIntFreq;

void setup() {

  cli(); // stop interrupts

  // set timer0 interrupt at 62 Hz
  TCCR0A = 0; // set TCCR0A register to 0
  TCCR0B = 0; // set TCCR0B register to 0
  TCNT0  = 0; //initialize counter value to 0

  // set compare match register for 62 Hz increments
  OCR0A = 251; // = ((16*10^6) / (Hz * 1024)) - 1 (max 256)

  // turn on CTC mode
  TCCR0A |= (1 << WGM01);

  // set CS10 and CS12 bits for 1024 prescaler
  TCCR0B |= (1 << CS12) | (1 << CS10);

  // enable timer compare interrupt
  TIMSK0 |= (1 << OCIE0A);

  sei(); // allow interrupts

  Serial.begin(115200);
  gpsSerial.begin(9600);
  pmsSerial.begin(9600);

  delay(30000); // wait for PM sensor readings to stabilise

}

void loop() {
  // continuously poll the GPS and PM sensors

  while (gpsSerial.available()) { // check for gps data

    if (gps.encode(gpsSerial.read())) { // encode gps data

      gps.f_get_position(&lat, &lon); // get latitude and longitude

    }

  }

  pms.read(data);

}

ISR(TIMER0_COMPA_vect) {
  // interrupt service routine

  intInc++;

  if (intInc >= intThreshold) { // trigger write out every intThreshold cycles
    // example stream "11, 20, 22, XX.XXXXXX, YY.YYYYYY"

    Serial.print(data.PM_AE_UG_1_0); // atmospheric PM 1.0 (μg/m3)
    Serial.print(", ");
    Serial.print(data.PM_AE_UG_2_5); // atmospheric PM 2.5 (μg/m3)
    Serial.print(", ");
    Serial.print(data.PM_AE_UG_10_0); // atmospheric PM 10.0 (μg/m3)
    Serial.print(", ");
    Serial.print(lat, 6); // controller latitude
    Serial.print(", ");
    Serial.println(lon, 6); // controller longitude

    intInc = 0; // reset increment

  }

}
