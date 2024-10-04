// convert to date
const convertToDay = (timeArray) => {
  // Kiểm tra xem timeArray có tồn tại và có ít nhất 5 phần tử
  if (!timeArray || timeArray.length < 5) {
    return "Invalid date";
  }

  const date = new Date(
    timeArray[0], // Năm
    timeArray[1] - 1, // Tháng (giảm 1 vì tháng trong JS bắt đầu từ 0)
    timeArray[2], // Ngày
    timeArray[3], // Giờ
    timeArray[4] // Phút
  );

  // Chuyển đổi thành chuỗi theo định dạng mong muốn
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const convertToHour = (timeArray) => {
  if (timeArray === null) {
    return;
  }
  const date = new Date(
    timeArray[0], // Năm
    timeArray[1] - 1, // Tháng (giảm 1 vì tháng trong JS bắt đầu từ 0)
    timeArray[2], // Ngày
    timeArray[3], // Giờ
    timeArray[4] // Phút
  );
  // Chuyển đổi thành chuỗi theo định dạng mong muốn

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatDayFromApi = (timeArray) => {
  if (!timeArray || timeArray.length < 5) {
    return "Invalid date";
  }

  const date = new Date(
    timeArray[0], // Năm
    timeArray[1] - 1, // Tháng (giảm 1 vì tháng trong JS bắt đầu từ 0)
    timeArray[2], // Ngày
    timeArray[3], // Giờ
    timeArray[4] // Phút
  );

  // Chuyển đổi thành chuỗi theo định dạng mong muốn
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

const isValidDOB = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  return birthDate < today;
};

function convertDobArrayToISO(dobArray) {
  const [year, month, day] = dobArray;
  // Ensure month and day are two digits by padding with zeroes if necessary
  const monthString = String(month).padStart(2, "0");
  const dayString = String(day).padStart(2, "0");
  return `${year}-${monthString}-${dayString}`;
}

const getSkillIds = (skills, optionsSkills) => {
  return (skills || [])
    .map((skill) => {
      const skillOption = optionsSkills.find(
        (option) => option.label.toLowerCase() === skill.toLowerCase()
      );
      return skillOption ? skillOption.value : null;
    })
    .filter((value) => value !== null);
};

const convertToDateTimeSQL6 = (date, time) => {
  // Ghép ngày và thời gian lại với nhau
  const dateTime = `${date}T${time}`;

  // Tạo đối tượng Date từ chuỗi này
  const dateObject = new Date(dateTime);

  // Chuyển đổi đối tượng Date thành chuỗi với đầy đủ giây
  const isoString = dateObject.toISOString().slice(0, 19);

  return isoString;
};

const getLabelFromValue = (object, value) => {
  const result = object.find((item) => item.value === value);
  return result ? result.label : value;
};

const handleClickURL = (event, link) => {
  event.preventDefault();
  window.open(`https://meet.google.com/${link}`, "_blank");
};

const getMeetID = (input) => {
  // Kiểm tra nếu đầu vào là một URL hay chỉ là ID
  const urlRegex = /meet.google.com\/([^\/]*)/;

  if (urlRegex.test(input)) {
    // Nếu là URL, trích xuất ID
    const match = input.match(urlRegex);
    return match[1];
  } else {
    // Nếu không phải là URL, giả định rằng đó là ID
    return input;
  }
};

function convertIDToLink(id) {
  const baseUrl = "https://meet.google.com/";
  return baseUrl + id;
}

function generateUsername(fullName) {
  const regex = /(?<FirstName>[A-Z][a-z]*)(?<Initials>[A-Z]{1,2})/;
  const match = fullName.match(regex);
  if (match && match.groups) {
    const { FirstName, Initials } = match.groups;
    return `${FirstName}${Initials}`;
  }
  return null;
}

export {
  convertToDay,
  convertToHour,
  isValidEmail,
  isValidPhone,
  isValidDOB,
  formatDayFromApi,
  convertDobArrayToISO,
  getSkillIds,
  convertToDateTimeSQL6,
  getLabelFromValue,
  handleClickURL,
  getMeetID,
  convertIDToLink,
  generateUsername,
};
