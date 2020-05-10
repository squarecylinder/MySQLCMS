const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },

        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },

        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },

        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
        },
        {
          name: "View All Employees By Department",
          value: "VIEW_ALL_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "View All Departments",
          value: "VIEW_ALL_DEPARTMENTS"
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT"
        },
        {
          name: "View All Employees By Manager",
          value: "VIEW_ALL_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "View All Roles",
          value: "VIEW_ALL_ROLES"
        },
        {
          name: "Add A Role",
          value: "ADD_ROLE"
        },
        {
          name: "Remove A Role",
          value: "REMOVE_ROLE"
        },
        {
          name: "View Budget",
          value: "VIEW_BUDGET"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "VIEW_ALL_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment();
    case "VIEW_BUDGET":
      return viewBudget();
    case "ADD_DEPARTMENT":
      return createDepartment();
    case "VIEW_ALL_DEPARTMENTS":
      return viewAllDepartment();
    case "REMOVE_DEPARTMENT":
      return removeDepartment();
    case "VIEW_ALL_EMPLOYEES_BY_MANAGER":
      return viewEmployeeByManager();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager();
    case "VIEW_ALL_ROLES":
      return viewAllRoles();
    case "ADD_ROLE":
      return addRole();
    case "REMOVE_ROLE":
      return removeRole();
    default:
      return quit();
  }
}
//save
async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}
//Create viewEmployeesByDepartment function
async function viewEmployeesByDepartment(){
  const department = await db.findAllDepartments();

  const departmentChoices = department.map(({id, name}) => ({
    name: name,
    value: id
  }));
  const {departmentId} = await prompt([
    {
    type: "list",
    name: "departmentId",
    message: "What department would you like to see?",
    choices: departmentChoices
  }
])
const result = await db.viewEmployeesByDepartment(departmentId)
  console.log("\n");
  console.table(result);
  loadMainPrompts();
}
//CREATE DEPARTMENT
async function createDepartment(){
  const department = await prompt([
    {
      type: "input",
      name: "name",
      message: "What is the new department called?"
    }
  ])
  await db.createDepartment(department);
  console.log("\n");
  console.log(department.name +" has been added!")
  loadMainPrompts();
}
//VIEW ALL DEPARTMENTS
async function viewAllDepartment(){
  const departments = await db.findAllDepartments();
  console.log("\n");
  console.table(departments);
  loadMainPrompts();
}
//REMOVE DEPARTMENT
async function removeDepartment(){
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({id, name}) => ({
    name: name,
    value: id
  }));
  const {departmentId} = await prompt([
    {
    type: "list",
    name: "departmentId",
    message: "What department would you like to remove?",
    choices: departmentChoices
    }]);
    console.log('\n');
    await db.removeDepartment(departmentId);
    loadMainPrompts();
  }
//VIEW BUDGET
async function viewBudget(){
  const departmentBudget = await db.viewBudget();
  console.table(departmentBudget);
  loadMainPrompts();
}
//Create viewEmployeesByManager function
async function viewEmployeeByManager(){
  const managers = await db.findAllManagers();
  const managerChoices = managers.map(({manager, manager_id}) => ({
    name: manager,
    value: manager_id
  }));
  for(let i = 0; i < managerChoices.length; i++){
    if (managerChoices[i].name == null){
      managerChoices.splice(i,1);
    }
  }
  const {managerId} = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Select a manager to view their direct reports.",
      choices: managerChoices
    }
  ]);
  console.log("---------")
  console.log(managerChoices);
  var result = await db.findDirectReports(managerId);
  console.log("\n")
  console.table(result)
  loadMainPrompts();
}
//Create updateEmployeeManager function
async function updateEmployeeManager(){
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to update their manager for?",
      choices: employeeChoices
    }
  ]);
  const {managerId} = await prompt([
    {
      type: "list",
      name:"managerId",
      message: "Pick a manager.",
      validate: function deleter(employeeId){
        
      },
      choices: employeeChoices
    }
  ]);
  await db.updateEmployeeManager(employeeId, managerId);
  console.log("\n");
  console.log("Manager updated");
  loadMainPrompts();
}
//Create viewRoles function
async function viewAllRoles(){
  var result = await db.findAllRoles();
  console.table(result);
  loadMainPrompts();
}
//Create addRole function
async function addRole(){
  const role = await prompt([
    {
      type: "input",
      name: "title",
      message: "What is the new role called?"
    }
  ])
  const {salary} = await prompt([
    {
      type: "input",
      name: "salary",
      message: "What is the salary",
      validate: function validateId(salary) {
        var isValid = !Number.isNaN(parseInt(salary));
        return isValid || "The salary must be a number!";
      }
    }
  ])
  role.salary = parseInt(salary);
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({id, name}) => ({
    name: name,
    value: id
  }));
  const {departmentId} = await prompt([
    {
    type: "list",
    name: "departmentId",
    message: "What department would you like to add this role too?",
    choices: departmentChoices
    }]);
  role.department_id = departmentId;
  await db.createRole(role);
  console.log("\n");
  loadMainPrompts();
}
//Create removeRole function
async function removeRole(){
  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to remove?",
      choices: roleChoices
    }
  ]);
  await db.deleteRole(roleId);
  console.log("\n");
  console.log("Role Removed!");
  loadMainPrompts();
}
//save
async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Employee Removed");

  loadMainPrompts();
}

//save
async function updateEmployeeRole() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  loadMainPrompts();
}


//save
async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });

  employee.manager_id = managerId;
  await db.createEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  loadMainPrompts();
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}
