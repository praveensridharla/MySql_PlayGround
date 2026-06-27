/* ============================================================
   data.js — Sample tables and dataset definitions
   ============================================================ */

const TABLES = {
  departments: {
    label: 'Departments',
    icon: 'ti-building',
    cols: [
      { name: 'dept_id', type: 'INT', pk: true },
      { name: 'dept_name', type: 'VARCHAR(60)', nn: true },
      { name: 'location', type: 'VARCHAR(80)' },
      { name: 'budget', type: 'DECIMAL(12,2)' }
    ],
    rows: [
      [1, 'Engineering', 'Hyderabad', 1200000],
      [2, 'Sales', 'Mumbai', 850000],
      [3, 'Marketing', 'Bengaluru', 600000],
      [4, 'HR', 'Hyderabad', 400000],
      [5, 'Finance', 'Mumbai', 500000]
    ]
  },

  employees: {
    label: 'Employees',
    icon: 'ti-users',
    cols: [
      { name: 'emp_id', type: 'INT', pk: true },
      { name: 'first_name', type: 'VARCHAR(50)', nn: true },
      { name: 'last_name', type: 'VARCHAR(50)', nn: true },
      { name: 'email', type: 'VARCHAR(100)' },
      { name: 'dept_id', type: 'INT', fk: 'departments' },
      { name: 'salary', type: 'DECIMAL(10,2)' },
      { name: 'hire_date', type: 'DATE' },
      { name: 'job_title', type: 'VARCHAR(80)' }
    ],
    rows: [
      [1, 'Arjun', 'Sharma', 'arjun@company.com', 1, 95000, '2020-03-15', 'Senior Engineer'],
      [2, 'Priya', 'Mehta', 'priya@company.com', 1, 85000, '2021-06-01', 'Backend Developer'],
      [3, 'Rahul', 'Verma', 'rahul@company.com', 2, 72000, '2019-11-20', 'Sales Manager'],
      [4, 'Sneha', 'Patel', 'sneha@company.com', 3, 68000, '2022-01-10', 'Marketing Lead'],
      [5, 'Kiran', 'Rao', 'kiran@company.com', 1, 90000, '2020-07-22', 'DevOps Engineer'],
      [6, 'Divya', 'Nair', 'divya@company.com', 4, 55000, '2021-09-05', 'HR Specialist'],
      [7, 'Amar', 'Singh', 'amar@company.com', 2, 76000, '2018-04-18', 'Sales Executive'],
      [8, 'Lakshmi', 'Iyer', 'lakshmi@company.com', 5, 82000, '2020-12-01', 'Finance Analyst'],
      [9, 'Suresh', 'Kumar', 'suresh@company.com', 1, 78000, '2022-03-11', 'Frontend Developer'],
      [10, 'Meera', 'Joshi', 'meera@company.com', 3, 65000, '2023-01-15', 'Content Strategist']
    ]
  },

  customers: {
    label: 'Customers',
    icon: 'ti-user-circle',
    cols: [
      { name: 'customer_id', type: 'INT', pk: true },
      { name: 'name', type: 'VARCHAR(100)', nn: true },
      { name: 'email', type: 'VARCHAR(100)' },
      { name: 'city', type: 'VARCHAR(60)' },
      { name: 'country', type: 'VARCHAR(60)' },
      { name: 'created_at', type: 'DATE' }
    ],
    rows: [
      [1, 'Ravi Teja', 'ravi@gmail.com', 'Hyderabad', 'India', '2022-01-05'],
      [2, 'Anjali Das', 'anjali@outlook.com', 'Kolkata', 'India', '2022-03-12'],
      [3, 'Carlos Ruiz', 'carlos@mail.com', 'Madrid', 'Spain', '2021-11-20'],
      [4, 'Mei Lin', 'mei@qq.com', 'Shanghai', 'China', '2023-02-28'],
      [5, 'Omar Faruk', 'omar@yahoo.com', 'Dhaka', 'Bangladesh', '2022-07-07'],
      [6, 'Preethi Raj', 'preethi@gmail.com', 'Chennai', 'India', '2023-04-14'],
      [7, 'James Miller', 'james@hotmail.com', 'New York', 'USA', '2021-08-30'],
      [8, 'Fatima Al-Hassan', 'fatima@mail.ae', 'Dubai', 'UAE', '2022-10-19']
    ]
  },

  products: {
    label: 'Products',
    icon: 'ti-package',
    cols: [
      { name: 'product_id', type: 'INT', pk: true },
      { name: 'product_name', type: 'VARCHAR(100)', nn: true },
      { name: 'category', type: 'VARCHAR(60)' },
      { name: 'price', type: 'DECIMAL(10,2)' },
      { name: 'stock_qty', type: 'INT' },
      { name: 'supplier', type: 'VARCHAR(80)' }
    ],
    rows: [
      [1, 'Laptop Pro 15', 'Electronics', 89999, 45, 'TechSource'],
      [2, 'Wireless Mouse', 'Electronics', 1299, 200, 'PeriphCo'],
      [3, 'Office Chair', 'Furniture', 12500, 30, 'ComfortPlus'],
      [4, 'Standing Desk', 'Furniture', 24999, 15, 'ComfortPlus'],
      [5, 'USB-C Hub', 'Electronics', 2499, 150, 'PeriphCo'],
      [6, 'Mechanical Keyboard', 'Electronics', 6999, 80, 'TechSource'],
      [7, 'Monitor 27"', 'Electronics', 32000, 25, 'DisplayTech'],
      [8, 'Notebook Set', 'Stationery', 299, 500, 'OfficeMart'],
      [9, 'Webcam HD', 'Electronics', 4500, 60, 'PeriphCo'],
      [10, 'Desk Lamp', 'Furniture', 1800, 90, 'ComfortPlus']
    ]
  },
 
  orders: {
    label: 'Orders',
    icon: 'ti-shopping-cart',
    cols: [
      { name: 'order_id', type: 'INT', pk: true },
      { name: 'customer_id', type: 'INT', fk: 'customers' },
      { name: 'order_date', type: 'DATE' },
      { name: 'status', type: 'VARCHAR(20)' },
      { name: 'total_amount', type: 'DECIMAL(12,2)' }
    ],
    rows: [
      [1, 1, '2023-01-10', 'delivered', 91298],
      [2, 2, '2023-02-14', 'delivered', 13799],
      [3, 3, '2023-03-01', 'shipped', 32000],
      [4, 1, '2023-03-20', 'pending', 6999],
      [5, 4, '2023-04-05', 'delivered', 24999],
      [6, 5, '2023-04-22', 'cancelled', 2499],
      [7, 6, '2023-05-11', 'delivered', 4500],
      [8, 7, '2023-06-03', 'shipped', 89999],
      [9, 2, '2023-06-17', 'pending', 1299],
      [10, 8, '2023-07-08', 'delivered', 38799]
    ]
  },

  order_items: {
    label: 'Order items',
    icon: 'ti-list',
    cols: [
      { name: 'item_id', type: 'INT', pk: true },
      { name: 'order_id', type: 'INT', fk: 'orders' },
      { name: 'product_id', type: 'INT', fk: 'products' },
      { name: 'quantity', type: 'INT', nn: true },
      { name: 'unit_price', type: 'DECIMAL(10,2)' }
    ],
    rows: [
      [1, 1, 1, 1, 89999],
      [2, 1, 2, 1, 1299],
      [3, 2, 8, 3, 299],
      [4, 2, 2, 1, 1299],
      [5, 3, 7, 1, 32000],
      [6, 4, 6, 1, 6999],
      [7, 5, 4, 1, 24999],
      [8, 6, 5, 1, 2499],
      [9, 7, 9, 1, 4500],
      [10, 8, 1, 1, 89999],
      [11, 9, 2, 1, 1299],
      [12, 10, 7, 1, 32000],
      [13, 10, 3, 1, 6799]
    ]
  },
  students: {
  label: 'Students',
  icon: 'ti-user',
  cols: [
    { name: 'student_id', type: 'INT', pk: true },
    { name: 'first_name', type: 'VARCHAR(50)', nn: true },
    { name: 'last_name', type: 'VARCHAR(50)' },
    { name: 'gender', type: 'VARCHAR(10)' },
    { name: 'department', type: 'VARCHAR(50)' },
    { name: 'year', type: 'INT' },
    { name: 'cgpa', type: 'DECIMAL(3,2)' },
    { name: 'advisor_id', type: 'INT', fk: 'faculty' }
  ],
  rows: [
    [101, 'Rahul', 'Sharma', 'Male', 'CSE', 1, 8.10, 1],
    [102, 'Priya', 'Reddy', 'Female', 'CSE', 2, 9.20, 2],
    [103, 'Arjun', 'Kumar', 'Male', 'ECE', 3, 7.80, 3],
    [104, 'Sneha', 'Patel', 'Female', 'EEE', 2, 8.90, 4],
    [105, 'Kiran', 'Rao', 'Male', 'MECH', 4, 7.40, 5],
    [106, 'Anjali', 'Verma', 'Female', 'CSE', 3, 9.50, 2],
    [107, 'Vikram', 'Singh', 'Male', 'ECE', 2, 8.30, 3],
    [108, 'Neha', 'Gupta', 'Female', 'CIVIL', 1, 8.70, 6],
    [109, 'Rohan', 'Das', 'Male', 'EEE', 4, 7.90, 4],
    [110, 'Pooja', 'Nair', 'Female', 'CSE', 4, 9.00, 1]
  ]
},

faculty: {
  label: 'Faculty',
  icon: 'ti-id-badge',
  cols: [
    { name: 'faculty_id', type: 'INT', pk: true },
    { name: 'faculty_name', type: 'VARCHAR(100)', nn: true },
    { name: 'department', type: 'VARCHAR(50)' }
  ],
  rows: [
    [1, 'Dr. Ramesh', 'CSE'],
    [2, 'Dr. Kavitha', 'CSE'],
    [3, 'Dr. Srinivas', 'ECE'],
    [4, 'Dr. Lakshmi', 'EEE'],
    [5, 'Dr. Mahesh', 'MECH'],
    [6, 'Dr. Joseph', 'CIVIL']
  ]
},

courses: {
  label: 'Courses',
  icon: 'ti-book',
  cols: [
    { name: 'course_id', type: 'INT', pk: true },
    { name: 'course_name', type: 'VARCHAR(100)', nn: true },
    { name: 'department', type: 'VARCHAR(50)' },
    { name: 'credits', type: 'INT' },
    { name: 'faculty_id', type: 'INT', fk: 'faculty' }
  ],
  rows: [
    [201, 'Database Management Systems', 'CSE', 4, 1],
    [202, 'Data Structures', 'CSE', 4, 2],
    [203, 'Operating Systems', 'CSE', 4, 2],
    [204, 'Digital Electronics', 'ECE', 3, 3],
    [205, 'Signals and Systems', 'ECE', 4, 3],
    [206, 'Power Systems', 'EEE', 4, 4],
    [207, 'Thermodynamics', 'MECH', 3, 5],
    [208, 'Structural Engineering', 'CIVIL', 4, 6]
  ]
},

enrollments: {
  label: 'Enrollments',
  icon: 'ti-write',
  cols: [
    { name: 'enrollment_id', type: 'INT', pk: true },
    { name: 'student_id', type: 'INT', fk: 'students' },
    { name: 'course_id', type: 'INT', fk: 'courses' },
    { name: 'semester', type: 'VARCHAR(20)' },
    { name: 'grade', type: 'VARCHAR(2)' },
    { name: 'marks', type: 'INT' }
  ],
  rows: [
    [1, 101, 201, 'Semester 1', 'A', 91],
    [2, 101, 202, 'Semester 1', 'B+', 84],
    [3, 102, 201, 'Semester 3', 'A+', 98],
    [4, 102, 203, 'Semester 3', 'A', 90],
    [5, 103, 204, 'Semester 5', 'B', 78],
    [6, 103, 205, 'Semester 5', 'A', 89],
    [7, 104, 206, 'Semester 3', 'A', 88],
    [8, 105, 207, 'Semester 7', 'B+', 81],
    [9, 106, 201, 'Semester 5', 'A+', 99],
    [10, 106, 203, 'Semester 5', 'A', 94],
    [11, 107, 204, 'Semester 3', 'B+', 83],
    [12, 107, 205, 'Semester 3', 'A', 87],
    [13, 108, 208, 'Semester 1', 'A', 92],
    [14, 109, 206, 'Semester 7', 'B', 76],
    [15, 110, 201, 'Semester 7', 'A', 93],
    [16, 110, 202, 'Semester 7', 'A+', 97],
    [17, 110, 203, 'Semester 7', 'A', 91]
  ]
}
};
