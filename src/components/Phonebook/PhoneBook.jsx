import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';

import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';
import ContactForm from './ContactForm/ContactForm';

import styles from './phoneBook.module.scss';

const CONTACTS = 'contacts';
const PhoneBook = () => {
  const [contacts, setContscts] = useState([]);
  const [filter, setFilter] = useState('');
  const [updated, setUpdated] = useState('');

  useEffect(() => {
    const contactsLocal = localStorage.getItem(CONTACTS);
    const parsedContacts = JSON.parse(contactsLocal);
    if (parsedContacts) {
      setContscts([...parsedContacts]);
    }
    setUpdated(true);
  }, []);

  useEffect(() => {
    if (!updated) {
      return;
    }
    localStorage.setItem(CONTACTS, JSON.stringify(contacts));
  }, [contacts, updated]);

  const addContact = (name, number) => {
    if (isDublicate(name)) {
      Notiflix.Notify.failure(`${name} is olready in contacts`);
      return;
    }

    setContscts(prevContact => {
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
    const filteredContscts = contacts.filter(({ name }) => {
      return name.toLocaleLowerCase().includes(normalizedFilter);
    });

    return filteredContscts;
  };

  const removeContact = id => {
    setContscts(prevContact => {
      return prevContact.filter(contsct => contsct.id !== id);
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