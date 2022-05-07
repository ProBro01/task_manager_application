var tasks = null
var currentedittask = null

var submitbutton = document.querySelector(".task__submit")
const URL = "http://192.168.247.14:4000"

// adding the task to the database

function makeInputEmpty() {
    document.querySelector('.task__input-field').value = ''
}

async function addToTask(event) {

    var taskname = document.querySelector(".task__input-field").value

    if (taskname === '') {
        // show message of empty task
        alert("Empty task")
    }
    else {
        var resp = await fetch(`${URL}/task/addtask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'name': taskname
            })
        })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err)
            })
            .then((json) => {
                makeInputEmpty()
                getAllTask(tasklistcont, (err, resp) => {getalltaskcallback(err, resp)})
                return json
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

submitbutton.addEventListener("click", addToTask)

// getting all the tasks
async function getAllTask(tasklistcont, callback) {
    try {
        tasklistcont.innerHTML = ''
        var resp = await fetch(`${URL}/task/getall`)
            .then((response) => response.json())
            .catch((err) => {
                callback(err)
            })
            .then((json) => {
                tasks = json
                for (var i = 0; i < tasks.length; i++) {
                    var taskelementcont = document.createElement('div')
                    taskelementcont.classList.add('taskelement__item')
                    var taskelementname = document.createElement('div')
                    taskelementname.classList.add('taskelement__name')
                    var taskelementp = document.createElement('p')
                    taskelementp.innerHTML = tasks[i].name
                    if(tasks[i].isCompleted){
                        taskelementp.classList.add('taskedit__name-line')
                    }
                    taskelementname.appendChild(taskelementp)
                    taskelementcont.appendChild(taskelementname)
                    var imgcont = document.createElement('div')
                    imgcont.classList.add('taskelement__img-cont')
                    var img1 = document.createElement('img')
                    img1.src = `${URL}/images/edit.png`
                    img1.id = `editimg${i}`
                    img1.setAttribute("taskid", tasks[i]._id)
                    var img2 = document.createElement('img')
                    img2.src = `${URL}/images/delete.png`
                    img2.id = `deleteimg${i}`
                    img2.setAttribute("taskid", tasks[i]._id)
                    imgcont.appendChild(img1)
                    imgcont.appendChild(img2)
                    taskelementcont.appendChild(imgcont)
                    tasklistcont.appendChild(taskelementcont)
                    /*
                        <div class='taskelement__item'>
                            <div class='taskelement__name'>
                                <p>Name</p>
                            <div>
                            <div class='taskelement__img-cont'>
                                <img>
                                <img>
                            </div>
                        </div>
                    */
                }
                callback(null, tasks)
                return json
            })
            .catch((err) => {
                callback(err)
            })
    }
    catch (err) {
        callback(err)
    }
}

function fillModal(event) {
    document.querySelector(".taskmodal__edit-warning").classList.add('hide')
    document.querySelector(".taskmodal__success-message").classList.add('hide')
    var modal = document.getElementById('modal')
    modal.classList.remove('hide')
    modal.classList.add('show')
    var taskid = event.target.getAttribute('taskid')
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i]._id === taskid) {
            currentedittask = tasks[i]
        }
    }
    document.querySelector(".taskedit__id-input").innerHTML = currentedittask._id
    document.querySelector(".taskedit__name-input").value = currentedittask.name
    if (currentedittask.isCompleted) {
        document.getElementById("taskedit__checkbox").value = "on"
        document.getElementById("taskedit__checkbox").checked = true
    }
    else {
        document.getElementById("taskedit__checkbox").value = "off"
        document.getElementById("taskedit__checkbox").checked = false
    }
    document.getElementById("taskmodal__close").addEventListener('click', hidemodal)
}

function hidemodal(event) {
    var modal = document.getElementById('modal')
    modal.classList.remove('show')
    modal.classList.add('hide')
}

var tasklistcont = document.querySelector(".tasklist")

// fetching all the tasks from the database
function getalltaskcallback(err, resp) {
    try {
        if (err === null) {
            for (var i = 0; i < tasks.length; i++) {
                document.getElementById(`editimg${i}`).addEventListener('click', fillModal)
                document.getElementById(`deleteimg${i}`).addEventListener('click', (event) => {
                    deletetask(event, (err) => {
                        if (err !== null) {
                            console.log(err)
                        }
                        else{
                            getAllTask(tasklistcont, (err, resp)  => {getalltaskcallback(err, resp)})
                        }
                    })
                })
            }
        }
        else {
            console.log("error occured!")
            console.log(err)
        }
    }
    catch (erro) {
        console.log(erro)
    }
}

getAllTask(tasklistcont, (err, resp) => {getalltaskcallback(err, resp)})

async function updatetask(event, callback) {
    try {
        var putbody = {
            taskid: currentedittask._id
        }
        var newname = document.querySelector(".taskedit__name-input").value
        var completed = document.getElementById("taskedit__checkbox").value
        if (newname !== currentedittask.name) {
            putbody.name = newname
        }
        else {
            putbody.name = ""
        }
        if (completed === "on") {
            putbody.completed = true
        }
        else {
            putbody.completed = false
        }
        if (putbody.name === "" && putbody.completed === currentedittask.isCompleted) {
            var warning = document.querySelector(".taskmodal__edit-warning")
            warning.classList.remove('hide')
            warning.classList.add('show')
        }
        else {
            await fetch(`${URL}/task/updatetask`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(putbody)
            })
                .then((response) => response.json())
                .catch((err) => callback(err))
                .then((json) => {
                    callback(null, json)
                })
                .catch((err) => {
                    callback(err)
                })
        }
    }
    catch (err) {
        callback(err)
    }
}

async function deletetask(event, callback) {
    var tasktodelete = { taskid: event.target.getAttribute('taskid') }
    fetch(`${URL}/task/deletetask`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasktodelete)
    })
        .then((response) => {
            return response.json()
        })
        .catch((err) => {
            callback(err)
        })
        .then((json) => {
            callback(null, json)
        })
        .catch((err) => {
            callback(err)
        })
}

document.getElementById("taskedit__checkbox").addEventListener('change', (event) => {
    if (event.target.value === "off") {
        event.target.value = "on"
    }
    else {
        event.target.value = "off"
    }
})

document.getElementById("taskmodal__button").addEventListener("click", (event) => updatetask(event, (err) => {
    var msgcont = document.querySelector(".taskmodal__success-message")
    var msg = document.querySelector(".successmsg")
    if (err !== null) {
        msgcont.classList.remove('hide')
        msgcont.classList.add('show')
        msgcont.classList.add('fail')
        msg.innerHTML = "Failed to Update task!"
    }
    else {
        msgcont.classList.remove('hide')
        msgcont.classList.add('show')
        msgcont.classList.add('success')
        document.querySelector(".taskmodal__edit-warning").classList.add('hide')
        document.querySelector(".taskmodal__edit-warning").classList.add('show')
        document.querySelector(".successmsg").innerHTML = "Task Updated Successfully!"
        getAllTask(tasklistcont, (err, resp) => {
            getalltaskcallback(err, resp)
        })
    }
}))