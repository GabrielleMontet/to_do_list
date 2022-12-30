fetch("http://192.168.1.99:9230/api/findAllTasks")
.then((response) => {
    return response.json();
})
    .then((data) => {
        tasksList = data.payload.map((element) =>
        {
            let task = {
                name:element.name,
                dueDate:element.dueDate
            }
            return task
        })
        renderList();
})
.catch((error) => {
    console.log("Error", error);
});

let tasksList = [];
let datesList = [];
let tasksContainer = document.querySelector("#tasksContainer");
let respTableBody = document.getElementById("resp-table-body");
let addButton = document.querySelector(".addButton");
let removeButton = document.querySelector(".removeButton");
let inputTask = document.querySelector("#inputTask");
let inputDate = document.querySelector("#inputDate");
let checkAll = document.querySelector("#checkAll");


//this renderList function should be called every time a task is added or removed (include it in the event listeners)
function renderList() {
    respTableBody.innerHTML="";

    for (let i=0; i<tasksList.length;i+=1) {
        const newRow = document.createElement("div");
        newRow.setAttribute("class", "resp-table-row");
        const new1stCell = document.createElement("div");
        new1stCell.setAttribute("class", "table-body-cell");
        const new2ndCell = document.createElement("div");
        new2ndCell.setAttribute("class", "table-body-cell");
        const new3rdCell = document.createElement("div");
        new3rdCell.setAttribute("class", "table-body-cell");
        const newContent = document.createTextNode(tasksList[i].name);
        const newCheckBox = document.createElement("input");
        const newDateContent = document.createTextNode(tasksList[i].dueDate);
        newCheckBox.setAttribute("name", "checkBox");
        newCheckBox.setAttribute("type", "checkBox");
        newCheckBox.setAttribute("class", "checkBoxTaskClass");
        newCheckBox.setAttribute("id", "checkBox_" + i);

        new1stCell.appendChild(newCheckBox);
        new2ndCell.appendChild(newContent);
        new3rdCell.appendChild(newDateContent);
        newRow.appendChild(new1stCell);
        newRow.appendChild(new2ndCell);
        newRow.appendChild(new3rdCell);
        respTableBody.appendChild(newRow);
        // newLi.addEventListener('click', function() {
        //     newCheckBox.setAttribute("checked", "true");})
    }
}


//for loop through all the checkboxes to check which ones are ticked and delete only the ticked boxes (slice the string of the checkbox id to get the index of the checkbox)
function removeTask() {
    let nbOfRemovedTasks = 0;
    let checkBoxes = document.querySelectorAll(".checkBoxTaskClass");
    for (let box of checkBoxes) {
        if (box.checked === true) {
            let indexesList = box.id.split("_");
            let index = indexesList[1] - nbOfRemovedTasks;
            tasksList.splice(index, 1);
            nbOfRemovedTasks++;
        }
    }
}

//function to change the format of the tasks list into the format accepted by the server
//later, will need to be changed to {payload: taskslist}
function formatList() {
    return {payload: tasksList.map(function (element){
    return {name:element.name,
        dueDate:element.dueDate};
})}}

//function to post the updated tasks list to the server
function postList() {
fetch("http://192.168.1.99:9230/api/replaceAllTasks", {
  method: "POST", 
  body: JSON.stringify(formatList()),
  headers: {
    'Content-Type': 'application/json'
  },
  mode: "no-cors"
}).then(res => {
  console.log("Request complete! response:", res);
});
}

//event listener to remove task
removeButton.addEventListener('click', function (){
    removeTask();
    renderList();
    postList();
});

//event listener to add element to the list through the button
addButton.addEventListener('click', function (){
    let addedTask = {
        name: inputTask.value,
        dueDate: inputDate.value
      };
    if (tasksList.map((task) => task.name).includes(addedTask.name)) {
        alert("This task is already included in the list - please enter a different task");
    }
    else {
    tasksList.push(addedTask);
    renderList()
    console.log(tasksList);
    postList();
    }
    });

// event listener to check/uncheck all checkboxes if main checkbox is ticked/unticked
checkAll.addEventListener('click', function(){
    let checkBoxes = document.querySelectorAll(".checkBoxTaskClass");
    if (checkAll.checked === true) {
        for (let box of checkBoxes) {
            box.checked = true}
        }
    else {
        for (let box of checkBoxes) {
        box.checked = false}
    }
    }

)
