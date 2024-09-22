import React, { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form';
import style from "./FormPage.module.css"

const URL = 'http://localhost:8000/users';

function UserForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [users, setUsers] = useState([]);
  const [modalMessage, setModalMessage] = useState('');


  async function fetchUsers() {
    const response = await fetch(URL);
    const data = await response.json();
    setUsers(data);
  }


  async function onSubmit(data) {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setModalMessage('Пользователь успешно создан');
      fetchUsers();
      reset();
    }
  }


  async function deleteUser(id) {
    const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setModalMessage('Пользователь удален');
      fetchUsers();
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Управление пользователями</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Имя:</label>
          <input {...register('name', { required: 'Имя обязательно' })} />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div>
          <label>Email:</label>
          <input {...register('email', {
            required: 'Email обязателен',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Неверный формат email' }
          })} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <label>Username:</label>
          <input {...register('username', { required: 'Username обязателен' })} />
          {errors.username && <span>{errors.username.message}</span>}
        </div>

        <button type="submit">Создать пользователя</button>
      </form>

      {modalMessage && (
          <div className={style.modalBlock}>
            <div className={style.modal}>
              <p>{modalMessage}</p>
              <button onClick={() => setModalMessage('')}>Закрыть</button>
            </div>
          </div>
            )}

            <h3>Список пользователей</h3>
            {users.length === 0 ? (
                <p>Список пуст</p>
            ) : (
                <table>
                  <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Действия</th>
                  </tr>
                  </thead>
                  <tbody>
                  {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>
                          <button onClick={() => deleteUser(user.id)}>Удалить</button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
      );
      }

      export default UserForm;