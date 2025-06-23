// Booking data including services, categories, time slots and calendar

// Service categories
export const categories = [
  { id: 1, name: "Dành cho mẹ", active: true },
  { id: 2, name: "Dành cho bé", active: false },
];

// Services for mothers
export const momServices = [
  {
    id: 1,
    name: "Chăm sóc tiền sản",
    description: "Chăm sóc và tư vấn cho bà bầu trước khi sinh",
    price: 900,
    duration: "1h",
    category: "mom",
  },
  {
    id: 2,
    name: "Chăm sóc hậu sản",
    description: "Chăm sóc cho mẹ sau khi sinh",
    price: 1150,
    duration: "1h",
    category: "mom",
  },
  {
    id: 3,
    name: "Massage bầu",
    description: "Massage đặc biệt cho bà bầu",
    price: 1500,
    duration: "1h 30m",
    category: "mom",
  },
  {
    id: 4,
    name: "Tư vấn dinh dưỡng",
    description: "Tư vấn về chế độ dinh dưỡng cho mẹ bầu",
    price: 800,
    duration: "45m",
    category: "mom",
  },
  {
    id: 5,
    name: "Yoga bầu",
    description: "Lớp yoga cho bà bầu",
    price: 1200,
    duration: "1h",
    category: "mom",
  },
];

// Services for children
export const babyServices = [
  {
    id: 6,
    name: "Chăm sóc trẻ sơ sinh",
    description: "Cho trẻ 0-12 tháng",
    price: 900,
    duration: "1h",
    category: "baby",
  },
  {
    id: 7,
    name: "Chăm sóc trẻ nhỏ",
    description: "Cho trẻ 1-3 tuổi",
    price: 1150,
    duration: "1h",
    category: "baby",
  },
  {
    id: 8,
    name: "Chăm sóc trẻ mẫu giáo",
    description: "Cho trẻ 3-5 tuổi",
    price: 1500,
    duration: "1h",
    category: "baby",
  },
  {
    id: 9,
    name: "Chăm sóc trẻ đặc biệt",
    description: "Chăm sóc đặc biệt cho trẻ có nhu cầu đặc biệt",
    price: 1700,
    duration: "1h",
    category: "baby",
  },
  {
    id: 10,
    name: "Hỗ trợ bài tập",
    description: "Hỗ trợ bài tập cho trẻ",
    price: 1200,
    duration: "1h",
    category: "baby",
  },
];

// Babysitters data
export const babysitters = [
  {
    id: 1,
    name: "Nguyễn Thị Ánh",
    experience: "5 năm",
    specialties: ["Chăm sóc trẻ sơ sinh", "Chăm sóc mẹ hậu sản"],
    rating: 4.8,
    image: "./assets/mother1.jpg",
    availability: {
      "Sun 16": ["9:00pm", "4:45pm", "5:00pm"],
      "Mon 17": ["5:15pm", "5:30pm", "5:45pm"],
      "Tue 18": ["6:00pm", "8:00pm"],
      "Wed 19": ["4:45pm", "5:00pm", "5:15pm"],
      "Thu 20": ["5:30pm", "5:45pm", "6:00pm"],
      "Fri 21": ["8:00pm", "9:00pm"],
      "Sat 22": ["4:45pm", "5:00pm", "5:15pm"],
      "Sun 23": ["5:30pm", "5:45pm", "6:00pm"],
      "Mon 24": ["8:00pm", "9:00pm"],
    },
  },
  {
    id: 2,
    name: "Trần Thị Mai",
    experience: "3 năm",
    specialties: ["Yoga bầu", "Chăm sóc trẻ mẫu giáo"],
    rating: 4.7,
    image: "./assets/mother1.jpg",
    availability: {
      "Sun 16": ["5:15pm", "5:30pm", "5:45pm"],
      "Mon 17": ["6:00pm", "8:00pm", "9:00pm"],
      "Tue 18": ["4:45pm", "5:00pm", "5:15pm"],
      "Wed 19": ["5:30pm", "5:45pm", "6:00pm"],
      "Thu 20": ["8:00pm", "9:00pm"],
      "Fri 21": ["4:45pm", "5:00pm"],
      "Sat 22": ["5:15pm", "5:30pm", "5:45pm"],
      "Sun 23": ["6:00pm", "8:00pm"],
      "Mon 24": ["4:45pm", "5:00pm", "5:15pm"],
    },
  },
  {
    id: 3,
    name: "Phạm Thị Linh",
    experience: "7 năm",
    specialties: ["Chăm sóc trẻ đặc biệt", "Tư vấn dinh dưỡng"],
    rating: 4.9,
    image: "./assets/mother1.jpg",
    availability: {
      "Sun 16": ["6:00pm", "8:00pm", "9:00pm"],
      "Mon 17": ["4:45pm", "5:00pm"],
      "Tue 18": ["5:15pm", "5:30pm", "5:45pm"],
      "Wed 19": ["6:00pm", "8:00pm"],
      "Thu 20": ["9:00pm", "4:45pm", "5:00pm"],
      "Fri 21": ["5:15pm", "5:30pm", "5:45pm"],
      "Sat 22": ["6:00pm", "8:00pm"],
      "Sun 23": ["9:00pm", "4:45pm"],
      "Mon 24": ["5:00pm", "5:30pm", "5:45pm"],
    },
  },
  {
    id: 4,
    name: "Lê Thị Hồng",
    experience: "4 năm",
    specialties: ["Chăm sóc tiền sản", "Chăm sóc trẻ nhỏ"],
    rating: 4.6,
    image: "./assets/mother1.jpg",
    availability: {
      "Sun 16": ["4:45pm", "5:00pm"],
      "Mon 17": ["5:15pm", "5:30pm", "5:45pm"],
      "Tue 18": ["6:00pm", "8:00pm", "9:00pm"],
      "Wed 19": ["4:45pm", "5:00pm"],
      "Thu 20": ["5:15pm", "5:30pm", "5:45pm"],
      "Fri 21": ["6:00pm", "8:00pm", "9:00pm"],
      "Sat 22": ["4:45pm", "5:00pm"],
      "Sun 23": ["5:15pm", "5:30pm", "5:45pm"],
      "Mon 24": ["6:00pm", "8:00pm", "9:00pm"],
    },
  },
];

export const timeSlots = [
  "9:00pm",
  "4:45pm",
  "5:00pm",
  "5:15pm",
  "5:30pm",
  "5:45pm",
  "6:00pm",
  "8:00pm",
];

// Calendar data
export const calendarDays = [
  { day: "Sun", date: 16, available: true },
  { day: "Mon", date: 17, available: true },
  { day: "Tue", date: 18, available: true },
  { day: "Wed", date: 19, available: true },
  { day: "Thu", date: 20, available: true },
  { day: "Fri", date: 21, available: true },
  { day: "Sat", date: 22, available: true },
  { day: "Sun", date: 23, available: true },
  { day: "Mon", date: 24, available: true },
];

export const salon = {
  name: "MomBaby Care Center",
  location: "Quận 1, TP.HCM",
  image: "./assets/baby1.jpg",
};
