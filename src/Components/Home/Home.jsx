import React , { useState } from 'react'
import './Home.css';
import $ from 'jquery';
import  axios  from 'axios';
import { useEffect } from 'react';
import  jwtDecode  from 'jwt-decode'

export default function Home({crrUser}) {
    let {_id} = jwtDecode(localStorage.getItem("noteToken"));
    let token = localStorage.getItem("noteToken");
    if(localStorage.getItem('note-color') == null)
        localStorage.setItem('note-color' , '#C5C6C7');
//Data
const [addFlag, setAddFlag] = useState(false);
const [note, setNote] = useState({
    title:'',
    desc: '',
    userID: '',
    token: '',
})
const [Notes, setNotes] = useState([]);
const [loadingScreen, setLoadingScreen] = useState(true);
const [chosenID, setChosenID] = useState(null);

//Hocks
useEffect( () => {
    getNotes();
}, [])

//get Notes from API
async function getNotes()
{
    let  { data }  = await axios.get('https://route-egypt-api.herokuapp.com/getUserNotes', {
        headers: {
            token: token,
            userID: _id,
        }
    });
    setNotes(data.Notes);
    setLoadingScreen(false);
}

//Functions
function getNote(e)
{
    let newNote = {...note};
    let inputField = e.target.value;
    newNote[e.target.id] = inputField;
    checkInput(newNote);
    setNote(newNote);
}

function checkInput(newNote)
{
    if(newNote.title == '' || newNote.desc == '')
    {
        $("#addBtn").attr("disabled" , true);
        $("#addBtn").addClass("button-disabled");
        setAddFlag(false);
    }
    else
    {
        $("#addBtn").attr("disabled" , false);
        $("#addBtn").removeClass("button-disabled");
        setAddFlag(true);
        newNote.userID = crrUser._id;
        newNote.token = localStorage.getItem('noteToken');
    }
}

//Save Note to api
async function saveNote(e)
{
    e.preventDefault();
    let  { data }  = await axios.post('https://route-egypt-api.herokuapp.com/addNote' , note);
    document.getElementById("title").value = '';
    document.getElementById("desc").value = '';
    getNotes();
} 

function checkDelete(idx)
{
    setChosenID(idx);
}


//Delete Note from API
function delNote()
{
    let idx = chosenID;
    let noteDel = Notes[idx];
    if(noteDel._id != '')
    deleteFromAPI(noteDel._id);
    
}
//Delete all Notes
function delAll()
{
    document.getElementById('deleteAllBtn').innerText = 'Waiting..';
    Notes?.map((noteDel) => {
        (deleteFromAPI(noteDel._id));
    });
    setNotes(null);
}

async function deleteFromAPI(ID)
{
    const { data } = await axios.delete('https://route-egypt-api.herokuapp.com/deleteNote' , {
        data:{
            NoteID: ID,
        token: localStorage.getItem("noteToken"),
        }
    })
    getNotes();
    document.getElementById('deleteAllBtn').innerText = 'Delete All';
}

let editNote = {...note};
function displayOldData(idx)
{
    let {title , desc ,_id} = Notes[idx];
    setChosenID(_id);
    document.getElementById("editTitle").value = title;
    document.getElementById("editDesc").value = desc;
    let prevNote = {...note};
    prevNote.title = title ; prevNote.desc = desc;
    setNote(prevNote);
}

//Update Note in API
async function saveEditedNote(e)
{
    e.preventDefault();
    // editNote['NoteID'] = Notes[editedIndex]._id;
    if(note.hasOwnProperty('editDesc'))
    {
        editNote.desc = note.editDesc;
        delete editNote['editDesc'];
    }
    if(note.hasOwnProperty('editTitle'))
    {
        editNote.title = note.editTitle;
        delete editNote['editTitle'];
    }
    let { data } = await axios.put('https://route-egypt-api.herokuapp.com/updateNote' , {
        title: editNote.title,
        desc: editNote.desc,
        userID: editNote.userID,
        token: editNote.token,
        NoteID: chosenID
    });
    getNotes();

}

//open Note
function openNote(idx)
{
    setChosenID(idx);
    let note = Notes[idx];
    document.getElementById('openNoteTitle').innerHTML = note.title;
    document.getElementById('openNoteDesc').innerHTML = note.desc;
}
let currIndex = chosenID;
function nextNote()
{
    if(currIndex != Notes.length - 1)
        currIndex++;
    else
        currIndex = 0;
    openNote(currIndex);
}
function prevNote()
{
    if(currIndex != 0)
        currIndex--;
    else
        currIndex = Notes.length - 1;
    openNote(currIndex);
}

//colorBox
let boxWidth = $("#colorBox").outerWidth(true);
function showBox(){
    if($("#theme").css('right') == '30px')
    {
        $("#theme").animate({'right' : `-=${boxWidth}`} , 300);
    }
    else
    {
        $("#theme").animate({'right' : `30px`} , 300);
    }
}
$("#theme span").click(function(e){
    $(".chosenColor").css("background-color" , $(e.target).css("background-color"));
    localStorage.setItem('note-color' , $(e.target).css("background-color"));
})

return <>
    {
        loadingScreen? 
        <div className="spin position-absolute end-0 top-0 start-0 bottom-0 d-flex justify-content-center align-items-center">
            <div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>
        </div>
        :
        <>
        <div className="addNote mt-5 d-flex justify-content-end">
        <button type="button" className="btn btn-primary text-white fw-bold me-3 btnMain" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Add Note
        </button>
        <button id='deleteAllBtn' className="btn btn-danger text-white fw-bold btnMain" data-bs-toggle="modal" data-bs-target="#deleteAllNotes">
            Delete All
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title my-1" id="exampleModalLabel">Title</h5>
                    <button type="button" className="btn-close me-2" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="floating-label-group">
                                    <input autoComplete="off" autoFocus required typeof="text" onChange={getNote} className='form-control' id='title'/> 
                                    <label className="floating-label">Title</label>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="floating-label-group mt-2">
                                    <textarea placeholder='Type your Note' autoComplete="off" autoFocus required rows="9" onChange={getNote} cols="50"  className='form-control' id='desc'/> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button typeof="button" onClick={ saveNote }  className="btn btn-primary text-white button-disabled" id='addBtn' data-bs-toggle="modal" data-bs-target="#checkedModal" data-bs-dismiss="modal" > Add</button>
                    <button typeof="button" onClick={ saveNote } data-bs-dismiss="modal" className="btn btn-danger">Cancel</button>
                </div>
                </div>
            </div>
        </div>
        </div>

        {/* Add Note Modal */}
        <div className="modal fade" id="checkedModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Done</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="wrapper"> <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        </div>
        
        <div className="notes">
            <div className="container">
                <div className="row gy-5">
                    {
                        Notes?.map( (note , idx) => {
                            if(note.title != '' && note.desc != '')
                            {   
                            return <>
                                <div className="col-lg-3 col-sm-6 position-relative" key={idx}>
                                    <div className="note text-center chosenColor rounded-3" key={idx} style={{backgroundColor: localStorage.getItem('note-color')}}>
                                    <div class="pin">
                                        <div class="metal"></div>
                                        <div class="bottom-circle"></div>
                                    </div>
                                        <div className="dropdown d-flex justify-content-end me-3 pt-3">
                                            <i className="fa-solid fa-grip-vertical" data-bs-toggle="dropdown"></i>
                                            <ul className="dropdown-menu">
                                                <div onClick={() => { displayOldData(idx) }} data-bs-toggle="modal" data-bs-target="#editModal" className="dropdown-item editSection d-flex justify-content-between px-3 fs-6 text-info">
                                                    <p className='my-0'> Edit </p>
                                                    <i className="fa-solid fa-square-pen"></i>
                                                </div>
                                                <div onClick={() => { checkDelete(idx) }} data-bs-toggle="modal" data-bs-target="#checkDelete" className="dropdown-item deleteSection d-flex justify-content-between px-3 fs-6 text-danger">
                                                    <p className='my-0'> Delete </p>
                                                    <i className="fa-solid fa-trash"></i>
                                                </div>
                                            </ul>
                                        </div>
                                        <div className="note-data py-3 pb-5" data-bs-toggle="modal" data-bs-target="#openNote" onClick={() => {openNote(idx)} }>
                                            <div id="note-content" className=''>
                                                <span className='bg-info' id='note-span'>
                                                    <p className='fs-3 mb-2 mx-5'> {note.title} </p>
                                                    <p className='fs-6 mx-3'> {note.desc} </p>
                                                </span>
                                            </div>     
                                        </div>
                                    </div>
                                </div>
                                </>
                            }
                            else
                            return '';
                        })
                    }
                </div>


                {/* Open Note Modal */}
                <div className="modal fade openNoteModal text-center" id="openNote" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content chosenColor rounded-3" style={{backgroundColor: localStorage.getItem('note-color')}}>
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-1">
                                        <div className="left-arrow fs-4 d-flex justify-content-center align-items-center h-100">
                                            <i className="fa-solid fa-circle-left" onClick={prevNote}></i>
                                        </div>
                                    </div>
                                    <div className="col-10">
                                        <p className='text-center fs-3' id='openNoteTitle'></p>
                                        <p className='text fs-6' id='openNoteDesc'></p>
                                    </div>
                                    <div className="col-1">
                                        <div className="right-arrow fs-4 d-flex justify-content-center align-items-center h-100">
                                            <i className="fa-solid fa-circle-right" onClick={nextNote}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title my-1" id="exampleModalLabel">Title</h5>
                            <button type="button" className="btn-close me-2" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="floating-label-group">
                                            <input autoComplete="off" autoFocus required typeof="text" onChange={getNote} className='form-control' id='editTitle'/> 
                                            <label className="floating-label">Title</label>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="floating-label-group mt-2">
                                            <textarea placeholder='Type your Note' autoComplete="off" autoFocus required rows="9" onChange={getNote} cols="50"  className='form-control' id='editDesc'/> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button typeof="button" onClick={ saveEditedNote }  className="btn btn-primary text-white editBtn" id='addBtn' data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#checkedModal"> Edit </button>
                            <button typeof="button" onClick={ saveEditedNote } data-bs-dismiss="modal" className="btn btn-danger">Cancel</button>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Check Delete All Modal */}
                <div className="modal fade" id="deleteAllNotes" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Confirmation</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete all notes?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={delAll} data-bs-dismiss="modal">Yes</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">No</button>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Check Delete Modal */}
                <div className="modal fade" id="checkDelete" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Confirmation</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this note?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success" onClick={delNote} data-bs-dismiss="modal">Yes</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">No</button>
                        </div>
                        </div>
                    </div>
                </div>


            </div>
                
        </div>

        {/* colorBox */}
        <div id="theme">
            <div id="colorBox" className="p-2">
                <span className="grey mx-1"></span>
                <span className="cyan mx-1"></span>
                <span className="blue mx-1"></span>
            </div>
        </div>
        <div className="open-box p-2 rounded-1 d-inline-block position-fixed" id='gear' onClick={showBox}>
            <i className="fa-solid fa-gear fa-spin text-white"></i>    
        </div>
        
        </>
    }
    

    
</>
}
