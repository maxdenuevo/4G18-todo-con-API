import React, { useState, useEffect } from 'react';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const userName = 'alesanchezr';

  useEffect(() => {
    fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al obtener las tareas: ' + resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      if (Array.isArray(data.todos)) {
        setTareas(data.todos);
      } else {
        setTareas([]);
      }
    })
    .catch(error => {
      console.log(error);
      setTareas([]);
    });
  }, []);

  const crearTarea = (tarea) => {
    fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
      method: 'POST',
      body: JSON.stringify({ label: tarea, done: false }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al crear la tarea: ' + resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      setTareas([...tareas, data]);
    })
    .catch(error => console.log(error));
  };

  const eliminarTarea = (tareaId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al eliminar la tarea: ' + resp.statusText);
      }
      setTareas(tareas.filter(tarea => tarea.id !== tareaId));
    })
    .catch(error => console.log(error));
  };

  const agregarTarea = (e) => {
    if (e.key === 'Enter' && nuevaTarea.trim() !== '') {
      crearTarea(nuevaTarea);
      setNuevaTarea('');
    }
  };

  return (
    <div className="container">
      <h1 className="display-2 text-danger text-opacity-25 text-center mt-4 mb-4">todos</h1>
      <div className="card">
        <div className="card-body">
          <div className="input-group input-group-lg mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="¿Qué se necesita hacer?"
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              onKeyDown={agregarTarea}
            />
          </div>
          <ul className="list-group">
            {tareas.length === 0 ? (
              <li className="list-group-item text-center">No hay tareas, añade tareas</li>
            ) : (
              tareas.map((tarea, indice) => (
                <li key={indice} className="list-group-item d-flex justify-content-between align-items-center">
                  {tarea.label}
                  <button
                    className="btn btn-link p-0"
                    onClick={() => eliminarTarea(tarea.id)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      <div className="text-center mt-3">
        {tareas.length} tarea{tareas.length !== 1 && 's'} restante{tareas.length !== 1 && 's'}
      </div>
    </div>
  );
};

export default Tareas;