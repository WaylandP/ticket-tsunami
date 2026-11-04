// Every ticket in the game. Each one has exactly one right fix.
// Keep text under 90 characters and keep it readable by people who don't work in IT.

export const TICKETS = [
  // Restart it
  { fix: 'restart', text: 'My laptop has been "thinking" since Tuesday.' },
  { fix: 'restart', text: 'The little loading wheel will not stop spinning.' },
  { fix: 'restart', text: 'The video call froze on my face mid-sneeze. Please hurry.' },
  { fix: 'restart', text: 'My mouse moves but nothing I click does anything.' },
  { fix: 'restart', text: 'Laptop fan sounds like it is preparing for takeoff.' },
  { fix: 'restart', text: 'Uptime says 94 days. Is that bad? It feels bad.' },
  { fix: 'restart', text: 'The spreadsheet is "Not Responding" and honestly neither am I.' },
  { fix: 'restart', text: 'My screen is frozen on a very unflattering slide.' },
  { fix: 'restart', text: 'Everything is slow. I have 212 browser tabs open, unrelated.' },
  { fix: 'restart', text: 'The printer shows a blinking light and a vague sense of dread.' },
  { fix: 'restart', text: 'My headset says I’m in a call. I am not in a call.' },
  { fix: 'restart', text: 'The cursor is gone. It was here this morning.' },
  { fix: 'restart', text: 'Microphone stopped working right before I was going to talk.' },

  // Reset password
  { fix: 'password', text: 'I changed my password yesterday and forgot it overnight.' },
  { fix: 'password', text: 'Locked out after trying my old password 11 times.' },
  { fix: 'password', text: 'It says my password expired. I did not give it permission.' },
  { fix: 'password', text: 'The sticky note with my password went through the wash.' },
  { fix: 'password', text: 'I typed my password with caps lock on. Now I’m locked out.' },
  { fix: 'password', text: 'Got a new phone and my login codes didn’t come with me.' },
  { fix: 'password', text: 'My password was “Summer2026!” and now it’s fall.' },
  { fix: 'password', text: 'Account locked. I may have let my kid “help.”' },
  { fix: 'password', text: 'Back from vacation and my brain deleted my password.' },
  { fix: 'password', text: 'Email login keeps saying “incorrect.” I am very correct.' },
  { fix: 'password', text: 'I reset my password and the new one is also wrong somehow.' },
  { fix: 'password', text: 'Can’t sign in. My cat walked across the keyboard 6 times.' },

  // Check connection
  { fix: 'connect', text: 'Internet is down. Also the cable is on the floor. Related?' },
  { fix: 'connect', text: 'Wi-Fi shows one bar and a lot of attitude.' },
  { fix: 'connect', text: 'Can’t reach any website. Airplane mode? What airplane?' },
  { fix: 'connect', text: 'Monitor is black. It is plugged into the wall. Just the wall.' },
  { fix: 'connect', text: 'My second screen vanished when I moved my coffee mug.' },
  { fix: 'connect', text: 'Printer says “offline.” It is right next to me. Online.' },
  { fix: 'connect', text: 'Video call keeps dropping since I moved to the patio.' },
  { fix: 'connect', text: 'Keyboard stopped typing. The dongle may be in the vacuum.' },
  { fix: 'connect', text: 'The VPN says connecting… connecting… connecting…' },
  { fix: 'connect', text: 'Laptop is at 1% and the charger is in my car.' },
  { fix: 'connect', text: 'Headphones play sound for everyone except me.' },
  { fix: 'connect', text: 'I’m on the “Guest_Free_WiFi” from the coffee shop next door.' },

  // Install updates
  { fix: 'update', text: 'The app says it’s too old to open. It’s from 2019.' },
  { fix: 'update', text: 'I’ve clicked “Remind me tomorrow” 47 days in a row.' },
  { fix: 'update', text: 'Browser says “unsupported version.” Rude.' },
  { fix: 'update', text: 'The meeting app won’t let me join until I update. Meeting is now.' },
  { fix: 'update', text: 'A pop-up keeps begging me to update. Can it stop begging?' },
  { fix: 'update', text: 'Security alert says my laptop is “critically out of date.”' },
  { fix: 'update', text: 'New feature everyone is talking about doesn’t show up for me.' },
  { fix: 'update', text: 'The chat app says my version is “no longer supported.”' },
  { fix: 'update', text: 'Printer driver from a previous decade. Printer is sulking.' },
  { fix: 'update', text: 'Phone says it needs an update before it will sync email.' },
  { fix: 'update', text: 'Spreadsheet opens in “compatibility mode” and looks haunted.' },
  { fix: 'update', text: 'My laptop’s OS is so old the wallpaper is a flip phone.' },

  // Not an IT problem
  { fix: 'notit', text: 'The office coffee machine is making sad noises.' },
  { fix: 'notit', text: 'Can IT make the meeting at 4 PM go away?' },
  { fix: 'notit', text: 'There is a bird in the break room. Please advise.' },
  { fix: 'notit', text: 'My chair squeaks every time I lean back. Urgent.' },
  { fix: 'notit', text: 'Who do I talk to about the thermostat war on floor 3?' },
  { fix: 'notit', text: 'Can you make my boss reply to my email faster?' },
  { fix: 'notit', text: 'The microwave says “Err.” Is that a virus?' },
  { fix: 'notit', text: 'Someone ate my labeled yogurt. Can you check the logs?' },
  { fix: 'notit', text: 'My parking badge doesn’t open the gate.' },
  { fix: 'notit', text: 'Can you fix my fantasy football lineup? It’s for work.' },
  { fix: 'notit', text: 'The vending machine ate my dollar and I want justice.' },
  { fix: 'notit', text: 'Can IT approve my vacation days? It’s quicker than HR.' },
  { fix: 'notit', text: 'My desk plant looks dehydrated. Is there an update for that?' },
];

export const NAMES = [
  'Priya in Sales', 'Marcus in Finance', 'Dana from HR', 'Leo in Marketing', 'Aisha in Legal',
  'Tom from Ops', 'Rosa in Design', 'Ken in Accounting', 'Omar in Support',
  'Beth in Recruiting', 'Sam from Facilities', 'Nia in Product', 'Mei in Data',
  'Carlos in Sales', 'Hannah from the 3rd floor', 'Ravi in Engineering', 'Zoe in Payroll',
];

// Junk mail. The right answer is always "Not an IT problem", closing one pays
// a bonus, and letting one rot costs nothing — recognizing them is the skill.
export const SPAM = [
  { text: 'CONGRATS!!! You won a free tablet. Claim it in the next 10 minutes!!', from: 'Totally Legit Prizes' },
  { text: 'Your paycheck is ON HOLD. Verify your login at pay-roll-fix.example', from: 'Payroll “Support”' },
  { text: 'I am a prince with 94 laptops to give away. Reply with your password.', from: 'A Generous Stranger' },
  { text: 'FINAL NOTICE: your printer warranty expires TODAY. Act now!!!', from: 'Warranty Central' },
  { text: 'We noticed you own a computer. Click here to make it 600% faster.', from: 'speedy-pc-deals.example' },
  { text: 'Exclusive webinar: Synergize Your Workflow. Only 9,999 seats left.', from: 'The Webinar People' },
];

// Regulars you get to know. Learn their habits and you can close their
// tickets without reading them — that's the whole point.
export const REGULARS = [
  { name: 'Gary (it\u2019s always Gary)', fix: 'password' }, // locked out, every time
  { name: 'Frank, remote', fix: 'connect' }, // it's always the connection
  { name: 'Jules the intern', selfFix: true }, // usually figures it out alone
];
