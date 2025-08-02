// Calendar AD/BS toggle logic
const calendarTypeSelect = document.getElementById('calendar-type');
const currentMonthHeader = document.getElementById('current-month');
const calendarDays = document.getElementById('calendar-days');
const yearSelect = document.getElementById('year-select');
const monthSelect = document.getElementById('month-select');
const todayBtn = document.querySelector('.today-btn');
const upcomingEventsList = document.getElementById('upcoming-events-list');
const myNotesList = document.getElementById('my-notes-list');
const addNoteBtn = document.getElementById('add-note-btn');

// Helper: Nepali numbers
function toNepaliNum(num) {
  const np = ['०','१','२','३','४','५','६','७','८','९'];
  return String(num).split('').map(d=>np[+d]||d).join('');
}
const nepaliMonths = ['बैशाख','जेठ','असार','श्रावण','भदौ','आश्विन','कार्तिक','मंसिर','पुष','माघ','फाल्गुण','चैत्र'];
const adMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Demo events (replace with real data)
const demoEvents = [
  { date: { bs: { y: 2082, m: 3, d: 20 } }, name: "Putrada Ekadashi Vrata", remain: "3 days remaining", desc: "A fasting ritual for the birth of a son, observed by Hindu devotees." },
  { date: { bs: { y: 2082, m: 3, d: 21 } }, name: "Pradosh Vrata", remain: "4 days remaining", desc: "A sacred day dedicated to Lord Shiva, observed with fasting and prayers." },
  { date: { bs: { y: 2082, m: 3, d: 23 } }, name: "Poornima Vrata", remain: "6 days remaining", desc: "Full moon day, considered auspicious for various religious activities." },
  { date: { bs: { y: 2082, m: 3, d: 24 } }, name: "Upcomming Event", remain: "7 days remaining", desc: "Special event details go here." },
  { date: { bs: { y: 2082, m: 3, d: 25 } }, name: "Janai Purnima", remain: "8 days remaining", desc: "A major Hindu festival celebrated by changing the sacred thread." , holiday: true}
];
let showOnlyHolidays = false;

function fillEventsSidebar() {
  let events = showOnlyHolidays ? demoEvents.filter(ev=>ev.holiday) : demoEvents;
  upcomingEventsList.innerHTML = events.map((ev,i) =>
    `<div class='event-list-item' data-idx='${i}' style='display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer;'>
      <div style='background:#1976d2;color:#fff;border-radius:8px;padding:7px 10px;font-weight:600;text-align:center;min-width:44px;'>
        <div style='font-size:1.1rem;'>${toNepaliNum(ev.date.bs.d)}</div>
        <div style='font-size:0.85rem;'>${nepaliMonths[ev.date.bs.m]}</div>
      </div>
      <div style='flex:1;'>
        <div style='font-weight:600;color:#b71c1c;'>${ev.name}</div>
        <div style='font-size:0.95rem;color:#888;'>${ev.remain}</div>
      </div>
    </div>`
  ).join('');
  // Add click listeners for event details
  document.querySelectorAll('.event-list-item').forEach(item => {
    item.onclick = function() {
      const ev = events[+item.getAttribute('data-idx')];
      document.getElementById('event-detail-title').textContent = ev.name;
      document.getElementById('event-detail-date').textContent = `${toNepaliNum(ev.date.bs.d)} ${nepaliMonths[ev.date.bs.m]}, ${toNepaliNum(ev.date.bs.y)}`;
      document.getElementById('event-detail-desc').textContent = ev.desc;
      document.getElementById('event-detail-modal').classList.add('active');
    };
  });
}
document.getElementById('show-all-events').onclick = function() {
  showOnlyHolidays = false;
  this.classList.add('active');
  document.getElementById('show-holidays').classList.remove('active');
  fillEventsSidebar();
};
document.getElementById('show-holidays').onclick = function() {
  showOnlyHolidays = true;
  this.classList.add('active');
  document.getElementById('show-all-events').classList.remove('active');
  fillEventsSidebar();
};
fillEventsSidebar();

// Notes logic (localStorage)
function renderNotes() {
  const notes = JSON.parse(localStorage.getItem('calendar_notes')||'[]');
  if (!notes.length) {
    myNotesList.textContent = 'You can add your notes here.';
  } else {
    myNotesList.innerHTML = notes.map(n=>`<div style='background:#fff7f0;border-radius:8px;padding:7px 10px;margin-bottom:7px;color:#b71c1c;'>${n}</div>`).join('');
  }
}
addNoteBtn.onclick = function() {
  const note = prompt('Enter your note:');
  if (note) {
    const notes = JSON.parse(localStorage.getItem('calendar_notes')||'[]');
    notes.push(note);
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
    renderNotes();
  }
};
renderNotes();

// Calendar logic
let adDate = new Date();
let bsYear, bsMonth;

function fillYearMonthDropdowns(type) {
  yearSelect.innerHTML = '';
  monthSelect.innerHTML = '';
  if (type === 'ad') {
    let y = adDate.getFullYear();
    for(let i=y-5;i<=y+5;i++) {
      yearSelect.innerHTML += `<option value="${i}" ${i===y?'selected':''}>${i}</option>`;
    }
    adMonths.forEach((m,i)=>{
      monthSelect.innerHTML += `<option value="${i}" ${i===adDate.getMonth()?'selected':''}>${m}</option>`;
    });
  } else {
    const bs = window.BSDate.fromAD(adDate);
    bsYear = bs.getYear();
    bsMonth = bs.getMonth();
    for(let i=bsYear-5;i<=bsYear+5;i++) {
      yearSelect.innerHTML += `<option value="${i}" ${i===bsYear?'selected':''}>${toNepaliNum(i)}</option>`;
    }
    nepaliMonths.forEach((m,i)=>{
      monthSelect.innerHTML += `<option value="${i}" ${i===bsMonth?'selected':''}>${m}</option>`;
    });
  }
}

function renderCalendar() {
  const type = calendarTypeSelect.value;
  fillYearMonthDropdowns(type);
  calendarDays.innerHTML = '';
  let today = new Date();
  let highlightToday = false;
  if (type === 'ad') {
    const year = +yearSelect.value;
    const month = +monthSelect.value;
    adDate = new Date(year, month, 1);
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    currentMonthHeader.textContent = adMonths[month] + ' ' + year;
    for(let i=0;i<firstDay;i++) {
      const div = document.createElement('div');
      div.className = 'calendar-day disabled';
      calendarDays.appendChild(div);
    }
    for(let d=1;d<=daysInMonth;d++) {
      const div = document.createElement('div');
      div.className = 'calendar-day';
      div.textContent = d;
      // Highlight today
      if (year===today.getFullYear() && month===today.getMonth() && d===today.getDate()) {
        div.style.background = '#ff8000';
        div.style.color = '#fff';
        div.style.fontWeight = '700';
      }
      calendarDays.appendChild(div);
    }
  } else {
    // Nepali calendar
    const year = +yearSelect.value;
    const month = +monthSelect.value;
    const bs = new window.BSDate(year, month, 1);
    adDate = bs.toAD();
    bsYear = year;
    bsMonth = month;
    currentMonthHeader.textContent = nepaliMonths[month] + ' ' + toNepaliNum(year);
    const firstDay = window.BSDate.getFirstDayOfWeek(year, month);
    const daysInMonth = window.BSDate.getNumDaysInMonth(year, month);
    // Find today in BS
    const todayBS = window.BSDate.fromAD(today);
    for(let i=0;i<firstDay;i++) {
      const div = document.createElement('div');
      div.className = 'calendar-day disabled';
      calendarDays.appendChild(div);
    }
    for(let d=1;d<=daysInMonth;d++) {
      const div = document.createElement('div');
      div.className = 'calendar-day';
      div.textContent = toNepaliNum(d);
      // Highlight today
      if (year===todayBS.getYear() && month===todayBS.getMonth() && d===todayBS.getDate()) {
        div.style.background = '#ff8000';
        div.style.color = '#fff';
        div.style.fontWeight = '700';
      }
      // Highlight event days
      demoEvents.forEach(ev => {
        if (ev.date.bs.y===year && ev.date.bs.m===month && ev.date.bs.d===d) {
          div.style.background = '#1976d2';
          div.style.color = '#fff';
          div.style.fontWeight = '700';
        }
      });
      calendarDays.appendChild(div);
    }
  }
}

calendarTypeSelect.addEventListener('change', renderCalendar);
yearSelect.addEventListener('change', renderCalendar);
monthSelect.addEventListener('change', renderCalendar);
todayBtn.addEventListener('click', function() {
  adDate = new Date();
  renderCalendar();
});
renderCalendar();

// Payment logic
const proceedBtn = document.getElementById('proceed-to-payment');
if (proceedBtn) {
  proceedBtn.addEventListener('click', function() {
    const selectedDate = document.querySelector('.calendar-day.selected');
    const selectedTime = document.querySelector('.time-slot.selected');
    const selectedPandit = document.querySelector('.pandit-card.selected');
    if (!selectedDate || !selectedTime || !selectedPandit) {
      alert('Please select a date, time, and pandit before proceeding');
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const type = urlParams.get('type');
    const date = new Date();
    date.setMonth(document.getElementById('current-month').textContent.split(' ')[0]);
    date.setDate(selectedDate.textContent);
    const time = selectedTime.textContent;
    const pandit = selectedPandit.querySelector('h4').textContent;
    window.location.href = `payment.html?service=${service}&type=${type}&date=${date.toISOString()}&time=${time}&pandit=${encodeURIComponent(pandit)}`;
  });
}
