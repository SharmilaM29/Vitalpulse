import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {removeNotification} from '../store/slices/notificationSlice'

function ErrorHandler() {
  const dispatch=useDispatch();
  const notifications=useSelector((state)=>state.notifications.items);

  useEffect(()=>{
    if (notifications.length===0) return;

    const timers=notifications.map((note)=>
    setTimeout(()=>{
      dispatch(removeNotification(note.id));
    }, 3000));

    return ()=> timers.forEach((t)=>clearTimeout(t));
  }, [notifications, dispatch]);

  if (notifications.length===0) return null;

  return (
    <div className='toast-container'>
      {notifications.map((note)=>(
        <div key={note.id} className={`toast toast-${note.type}`}>
          {note.message}
        </div>
      ))}
    </div>
  )
}

export default ErrorHandler
