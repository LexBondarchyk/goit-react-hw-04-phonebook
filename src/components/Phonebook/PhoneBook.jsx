import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';
import ContactForm from './ContactForm/ContactForm';

import styles from './phoneBook.module.scss';


const PhoneBook = () => {
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem('contacts')) ?? []
  );
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}, [contacts]);
 

  const addContact = (name, number) => {
    if (isDublicate(name)) {
      Notiflix.Notify.failure(`${name} is olready in contacts`);
      return;
    }

    setContacts(prevContact => {
      const contact = {
        id: nanoid(),
        name,
        number,
      };
      return [contact, ...prevContact];
    });
  };

  const isDublicate = name => {
    const normalizedName = name.toLocaleLowerCase();

    const result = contacts.find(({ name }) => {
      return name.toLocaleLowerCase() === normalizedName;
    });

    return Boolean(result);
  };

  const getFilteredContacts = () => {
    if (!filter) {
      return contacts;
    }

    const normalizedFilter = filter.toLocaleLowerCase();
    const filteredContacts = contacts.filter(({ name }) => {
      return name.toLocaleLowerCase().includes(normalizedFilter);
    });

    return filteredContacts;
  };

  const removeContact = id => {
    setContacts(prevContact => {
      return prevContact.filter(contact => contact.id !== id);
    });
  };

  const handleFilter = ({ target }) => {
    setFilter(target.value);
  };

  const contactsFilter = getFilteredContacts();
  const isContactsFilter = Boolean(contactsFilter.length);

  return (
    <section className={styles.sectionBook}>
      <h1 className={styles.title}>Phonebook</h1>
      <ContactForm onSubmit={addContact} />
      <h2 className={styles.titleContacts}>Contacts</h2>
      <Filter handleFilter={handleFilter} filter={filter} />
      {isContactsFilter && (
        <ContactList contacts={contactsFilter} remuveContact={removeContact} />
      )}
      {!isContactsFilter && <p>There is no contacts.</p>}
    </section>
  );
};

export default PhoneBook;