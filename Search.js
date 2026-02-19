// search rooms

const form = document.getElementById("search-form");
const results = document.getElementById("results");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // 入力値取得
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;

  const adults = Number(document.getElementById("adults").value);
  const children = Number(document.getElementById("children").value);
  const rooms = Number(document.getElementById("rooms").value);

  const roomType = document.getElementById("room-type").value;

  const totalGuests = adults + children;

  // ① 未入力チェック
  if (!name || !email || !checkin || !checkout || !roomType) {
    alert("すべての項目を入力してください。");
    return;
  }

  // 数値系の安全チェック（念のため）
  if (Number.isNaN(adults) || Number.isNaN(children) || Number.isNaN(rooms)) {
    alert("人数・部屋数を正しく入力してください。");
    return;
  }

  // ② 日付チェック
  if (checkin >= checkout) {
    alert("チェックアウト日はチェックイン日より後にしてください。");
    return;
  }

  // ③ 人数制限（合計10名まで）
  if (totalGuests > 10) {
    alert("人数制限は合計10名までです。");
    return;
  }

  // ④ 部屋数制限（最大3室まで）
  if (rooms > 3) {
    alert("部屋数は最大3室までです。");
    return;
  }

  // ⑤ 空室データ（仮・検証用）
  const availableRooms = [
    { type: "Standard Room", price: "¥8,000 / night", key: "standard" },
    { type: "Deluxe Room", price: "¥12,000 / night", key: "deluxe" },
    { type: "Suite", price: "¥20,000 / night", key: "suite" }
  ];

  // ⑥ 選択された部屋だけ表示
  const filteredRooms = availableRooms.filter(room => room.key === roomType);

  // ⑦ 結果表示
  results.innerHTML = `
    <h3>Available Rooms</h3>
    <div class="summary">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Check-in:</strong> ${checkin}</p>
      <p><strong>Check-out:</strong> ${checkout}</p>
      <p><strong>Guests:</strong> Adults ${adults}, Children ${children}（合計 ${totalGuests}）</p>
      <p><strong>Rooms:</strong> ${rooms}</p>
    </div>
  `;

  if (filteredRooms.length === 0) {
    results.innerHTML += `<p>選択した部屋タイプの空室が見つかりません。</p>`;
    return;
  }

  filteredRooms.forEach(room => {
    results.innerHTML += `
      <div class="room-card">
        <p><strong>${room.type}</strong></p>
        <p>${room.price}</p>
        <button type="button" class="next-btn"
          data-room="${room.key}"
          data-rooms="${rooms}"
          data-adults="${adults}"
          data-children="${children}"
          data-checkin="${checkin}"
          data-checkout="${checkout}"
        >next</button>
      </div>
    `;
  });

  // nextボタンのクリック（必要なら）
  document.querySelectorAll(".next-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // ここで次ページに渡す or localStorage 保存など
      alert("次へ進みます（ここに処理を追加できます）");
    });
  });
});




// 合計10人まで制限
const adults = document.getElementById("adults");
const children = document.getElementById("children");
const rooms = document.getElementById("rooms");

const guestWarning = document.getElementById("guest-warning");
const roomWarning = document.getElementById("room-warning");

function checkGuestsAndRooms() {
  const totalGuests = Number(adults.value) + Number(children.value);
  const totalRooms = Number(rooms.value);

  // 人数制限（10名まで）
  if (totalGuests > 10) {
    guestWarning.textContent = "人数制限は10名までです";
  } else {
    guestWarning.textContent = "";
  }

  // 部屋数制限（3室まで）
  if (totalRooms > 3) {
    roomWarning.textContent = "部屋数は最大3室までです";
  } else {
    roomWarning.textContent = "";
  }
}

adults.addEventListener("input", checkGuestsAndRooms);
children.addEventListener("input", checkGuestsAndRooms);
rooms.addEventListener("input", checkGuestsAndRooms);

