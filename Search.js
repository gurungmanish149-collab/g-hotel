const roomCatalog = {
  standard: {
    name: 'Standard Room',
    pricePerNight: 8000,
    details: 'Queen bed, city view, essentials included'
  },
  deluxe: {
    name: 'Deluxe Room',
    pricePerNight: 12000,
    details: 'King bed, larger space, premium amenities'
  },
  suite: {
    name: 'Executive Suite',
    pricePerNight: 20000,
    details: 'Separate lounge, luxury bathroom, premium service'
  }
};

const EMAILJS_PUBLIC_KEY = 'hHtZp0_z-JExoO-H1';
const EMAILJS_SERVICE_ID = 'service_hokfksb';
const EMAILJS_TEMPLATE_ID = 'template_34ekhql';

if (window.emailjs && EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.includes('YOUR_')) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const form = document.getElementById('search-form');
const results = document.getElementById('results');

async function sendBookingConfirmation(booking) {
  const hasEmailConfig =
    window.emailjs &&
    EMAILJS_SERVICE_ID &&
    !EMAILJS_SERVICE_ID.includes('YOUR_') &&
    EMAILJS_TEMPLATE_ID &&
    !EMAILJS_TEMPLATE_ID.includes('YOUR_');

  if (!hasEmailConfig) {
    return { success: false, message: 'EmailJS is not configured.' };
  }

  try {
    const templateParams = {
      guest_name: booking.name,
      guest_email: booking.email,
      room_name: booking.roomName,
      checkin: booking.checkin,
      checkout: booking.checkout,
      nights: booking.nights,
      total: formatCurrency(booking.total),
      message: `Thank you for booking with G Hotel. Your stay is confirmed. We look forward to welcoming you.`
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    return { success: true };
  } catch (error) {
    console.error('Failed to send booking email:', error);
    return {
      success: false,
      message: error?.text || error?.message || 'EmailJS could not send the confirmation.'
    };
  }
}

function calculateNights(checkin, checkout) {
  const start = new Date(checkin);
  const end = new Date(checkout);
  const diffMs = end - start;
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

function formatCurrency(value) {
  return `¥${value.toLocaleString('en-US')}`;
}

function validateBooking(values) {
  if (!values.name || !values.email || !values.checkin || !values.checkout || !values.roomType) {
    return 'Please fill in all required fields.';
  }

  if (values.checkin >= values.checkout) {
    return 'Check-out date must be later than the check-in date.';
  }

  if (values.totalGuests > 10) {
    return 'Maximum guest capacity is 10 people.';
  }

  if (values.rooms > 3) {
    return 'Maximum room count is 3 rooms.';
  }

  if (!(values.roomType in roomCatalog)) {
    return 'Please choose a valid room type.';
  }

  return '';
}

function renderResult(data) {
  const nights = calculateNights(data.checkin, data.checkout);
  const room = roomCatalog[data.roomType];
  const subtotal = room.pricePerNight * data.rooms * nights;
  const total = subtotal + 1200;

  results.innerHTML = `
    <div class="room-card">
      <h3>Available room</h3>
      <p><strong>${room.name}</strong></p>
      <p>${room.details}</p>
      <p><strong>Rate:</strong> ${formatCurrency(room.pricePerNight)} / night</p>
      <p><strong>Stay:</strong> ${nights} night(s)</p>
      <p><strong>Rooms:</strong> ${data.rooms}</p>
      <p><strong>Guests:</strong> ${data.totalGuests}</p>
      <p><strong>Subtotal:</strong> ${formatCurrency(subtotal)}</p>
      <p><strong>Service fee:</strong> ${formatCurrency(1200)}</p>
      <p><strong>Total:</strong> ${formatCurrency(total)}</p>
      <button type="button" class="confirm-btn">Confirm Booking</button>
    </div>
  `;

  const confirmButton = document.querySelector('.confirm-btn');
  if (confirmButton) {
    confirmButton.addEventListener('click', async () => {
      const booking = {
        ...data,
        roomName: room.name,
        nights,
        total,
        bookedAt: new Date().toISOString()
      };

      localStorage.setItem('ghotelBooking', JSON.stringify(booking));

      const emailResult = await sendBookingConfirmation(booking);

      const emailStatus = emailResult.success
        ? `A confirmation email has been sent to ${data.email}.`
        : `Your booking is saved locally, but the email was not sent. Error: ${emailResult.message}`;

      results.innerHTML = `
        <div class="room-card">
          <h3>Booking confirmed</h3>
          <p><strong>${data.name}</strong>, your reservation for ${room.name} is confirmed.</p>
          <p><strong>Check-in:</strong> ${data.checkin}</p>
          <p><strong>Check-out:</strong> ${data.checkout}</p>
          <p><strong>Total paid:</strong> ${formatCurrency(total)}</p>
          <p>${emailStatus}</p>
        </div>
      `;
    });
  }
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const values = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    checkin: document.getElementById('checkin').value,
    checkout: document.getElementById('checkout').value,
    adults: Number(document.getElementById('adults').value),
    children: Number(document.getElementById('children').value),
    rooms: Number(document.getElementById('rooms').value),
    roomType: document.getElementById('room-type').value
  };

  values.totalGuests = values.adults + values.children;

  const validationMessage = validateBooking(values);
  if (validationMessage) {
    alert(validationMessage);
    return;
  }

  renderResult(values);
});

const adults = document.getElementById('adults');
const children = document.getElementById('children');
const rooms = document.getElementById('rooms');
const guestWarning = document.getElementById('guest-warning');
const roomWarning = document.getElementById('room-warning');

function checkGuestsAndRooms() {
  const totalGuests = Number(adults.value) + Number(children.value);
  const totalRooms = Number(rooms.value);

  guestWarning.textContent = totalGuests > 10 ? 'Guest limit is 10 people.' : '';
  roomWarning.textContent = totalRooms > 3 ? 'Room limit is 3 rooms.' : '';
}

adults.addEventListener('input', checkGuestsAndRooms);
children.addEventListener('input', checkGuestsAndRooms);
rooms.addEventListener('input', checkGuestsAndRooms);

