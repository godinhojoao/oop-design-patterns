/*
Bridge = split huge classes or a set of classes into two separate pieces: abstraction and implementation.
-> abstraction = high-level control layer of some entity, delegates work to the implementation layer.
-> implementation = contains the behavior and logic.
--> Example: Abstraction (web GUI interface, CLI interface...)
--> Example: Implementation (internal API, 3rd party API, Windows API, linux API...)

# Problem
- You have a huge feature that uses multiple classes or a big class with complex logic and it contains multiple mixed logic between abstraction and implementation.
- You want to segregate this huge monolithic app into smaller pieces, separating the control logic from the behavior itself.
- For example: in the notification control flow you need to decide whether to send the message by email or sms.
  --> and you need to do that without adding multiple if/else branches into a huge monolithic class.

# Solution
- Implementation interface = defines the required behaviors common for all implementations.
- Concrete implementation = platform specific code (e.g. windows, linux...)
- Abstraction = contains a field that references the current implementation (received on constructor - dependency injection)
- Refined abstraction (optional) = extends the abstraction and adds new specialized methods.
- Client = communicates only with the abstraction and uses dependency injection to add the required implementation to the abstraction.
  - in this way one single api can work with multiple databases, we only need to send the current database (implementation) to the abstraction.
*/


// implementation interface
interface MessageChannel {
  send(to: string, body: string): void
}

// concrete implementation 1
class EmailChannel implements MessageChannel {
  send(to: string, body: string): void {
    console.log(`email to ${to}: ${body}`);
  }
}

// concrete implementation 2
class SmsChannel implements MessageChannel {
  send(to: string, body: string): void {
    console.log(`sms to ${to}: ${body}`);
  }
}

// abstraction
class Notification {
  constructor(protected readonly channel: MessageChannel, private readonly message: string) { }

  notify(to: string): void {
    this.channel.send(to, this.message);
  }
}

// refined abstraction: adds specialized logic on top of the base abstraction
class OtpNotification extends Notification {
  constructor(channel: MessageChannel, private readonly code: string) {
    super(channel, `your code is ${code}`);
  }

  resend(to: string): void {
    this.channel.send(to, `resending your code: ${this.code}`);
  }
}

new Notification(new EmailChannel(), "ALERT: high cpu usage").notify("email@email.com");

const otp = new OtpNotification(new SmsChannel(), "123456");
otp.notify("+999999999");
otp.resend("+999999999");
