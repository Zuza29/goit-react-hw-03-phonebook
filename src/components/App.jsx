import { Component } from 'react';
import { Form } from './Form/Form';
import { Section } from './Section/Section';
import { Notification } from './Notification/Notification';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { Notify } from 'notiflix';

export class App extends Component {
  
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(savedContacts);
    if (parsedContacts) {
      this.setState({
        contacts: parsedContacts,
      })
    }
  };

  componentDidUpdate(prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts))
    }
  };

  filter = e => {
    this.setState({
      filter: e.currentTarget.value,
    });
  };

  filterContacts = () => {
    const { filter, contacts } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  addUserToContacts = user => {
    this.setState({
      contacts: [...this.state.contacts, user],
    });
  };

  deleteContact = identification => {
    const deletedName = this.state.contacts.find(
      ({ id }) => id === identification
    ).name;
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(
        contact => contact.id !== identification
      ),
    }));
    Notify.success(`${deletedName} was deleted from the Phonebook.`);
  };

  render() {
    const value = this.state.filter;
    const filteredContacts = this.filterContacts();
    return (
      <div className="App">
        <Section title="Phonebook">
          <Form
            addUserToContacts={this.addUserToContacts}
            contacts={this.state.contacts}
            // name={this.state.name}
            // number={this.state.number}
            // handleChange={this.handleChange}
          ></Form>
        </Section>
        <Section title="Contacts">
          {this.state.contacts.length === 0 ? (
            <Notification message="There are no contacts yet" />
          ) : (
            <>
              <Filter
                value={value}
                onChange={this.filter}
                filteredContacts={this.filteredContacts}
              />
              <ContactList
                contacts={filteredContacts}
                deleteContact={this.deleteContact}
              ></ContactList>
            </>
          )}
        </Section>
      </div>
    );
  }
}
