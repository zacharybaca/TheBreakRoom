import './users.css';
import { useState, useEffect } from 'react';
import UserCard from '../UserCard/UserCard';

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch('https://fakerapi.it/api/v2/users?_quantity=30&_gender=male');
      const { data } = await response.json();
      setUsers(data); // ✅ set the whole array
      console.log('Users: ', data);
    } catch (error) {
      console.error("Error fetching fake users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div id="users-container">
      {users.length > 0 ? (
        users.map(person => (
          <UserCard 
           key={person.uuid} 
           id={person.uuid}
           firstName={person.firstname} 
           lastName={person.lastname}
           username={person.username}
           email={person.email}
           image={person.image}
           website={person.website}
          />
        ))
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
};

export default Users;
