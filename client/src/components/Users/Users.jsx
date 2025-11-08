import './users.css';
import { useState, useEffect } from 'react';
import UserCard from '../UserCard/UserCard';

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch(
        'https://fakerapi.it/api/v2/users?_quantity=30&_gender=male'
      );
      const { data } = await response.json();

      // Attach random style + tilt to each user
      const styledUsers = data.map((person) => {
        const attachmentStyles = [
          'pushpin',
          'tape',
          'tack',
          'safetypin',
          'paperclip',
          'magnet',
          'mappin',
          'nail',
        ];
        const randomStyle =
          attachmentStyles[Math.floor(Math.random() * attachmentStyles.length)];
        const randomTilt = Math.floor(Math.random() * 7 - 3); // -3 to +3 degrees
        return { ...person, attachment: randomStyle, tilt: randomTilt };
      });

      setUsers(styledUsers);
    } catch (error) {
      console.error('Error fetching fake users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <section className="users-wrapper">
      <div id="users-frame">
        <div id="users-container">
          {users.length > 0 ? (
            users.map((person) => (
              <UserCard
                key={person.uuid}
                id={person.uuid}
                firstName={person.firstname}
                lastName={person.lastname}
                username={person.username}
                email={person.email}
                image={person.image}
                website={person.website}
                attachment={person.attachment}
                tilt={person.tilt}
              />
            ))
          ) : (
            <div className="loading-container">
              <p className="loading-text">
                <img
                  src="/assets/waiting-loading-users.gif"
                  alt="waiting gif"
                />
                Loading users...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Users;
