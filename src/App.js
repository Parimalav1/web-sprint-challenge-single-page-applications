
import React, { useState, useEffect } from 'react'
import { Switch, Route, Link, useHistory } from 'react-router-dom'
import './App.css';
import * as Yup from 'yup'
import PizzaForm from './PizzaForm'
import PizzaSchema from './PizzaSchema'
import Pizza from './Pizza'
import Home from './Home'

const initialFormValues = {
  name: '',
  email: '',
  ///// DROPDOWN /////
  pizzaSize: '',
  pizzaCrust: '',
  ///// CHECKBOXES /////
  toppings: {
    olives: false,
    jalapenos: false,
    pineapple: false,
    mushrooms: false,
  },
  specialInstructions: ''
}

const firstErrors = {
  name: '',
  email: ''
}

const firstPizzaOrder = {
  ordered: false,
  pizzaSize: '',
  pizzaCrust: '',
  ///// CHECKBOXES /////
  toppings: {
    olives: false,
    jalapenos: false,
    pineapple: false,
    mushrooms: false,
  },
}

const firstDisabled = true;

const App = () => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [disabled, setDisabled] = useState(firstDisabled);
  const [error, setError] = useState(firstErrors);
  const [pizzaOrderList, setPizzaOrderList] = useState([firstPizzaOrder]);
  const history = useHistory();

  const onInputChange = evt => {
    let { name, value } = evt.target;
    if (name === 'name' || name === 'email') {
      Yup
      .reach(PizzaSchema, name)
      //we can then run validate using the value
      .validate(value)
      // if the validation is successful, we can clear the error message
      .then(() => {
        setError({
          ...error,
          [name]: ""
        });
      })
      /* if the validation is unsuccessful, we can set the error message to the message 
        returned from yup (that we created in our schema) */
      .catch(err => {
        setError({
          ...error,
          [name]: err.errors[0] // investigate
        })
      })
    }

    setFormValues({
      ...formValues,
      [name]: value // NOT AN ARRAY
    })
  }

  const onCheckboxChange = evt => {
    const { name, checked } = evt.target
    console.log('onCheckboxChange: ' + name + ' checked: ' + checked);
    const key = 'topping.' + name;
    setFormValues({
      ...formValues,
      toppings: {
        ...formValues.toppings,
        [name]: checked
      }
    })
    console.log('formValues: ' + JSON.stringify(formValues));
  }

  useEffect(() => {
    const formValuesSubset = {
      name: formValues.name, 
      email: formValues.email
    }
    PizzaSchema.isValid(formValuesSubset).then(valid => {
      console.log('valid: ' + valid);
      setDisabled(!valid);
    })
  }, [formValues])

  const onSubmit = evt => {
    evt.preventDefault();
    const newPizzaOrder = {
      ...formValues, ordered: true
    }
    setPizzaOrderList([...pizzaOrderList, newPizzaOrder]);
    history.push('/');
  }

  return (
    <div className='App'>
      <h1>Lambda Eats</h1>
        <nav>
          <div className='nav-links'>
            <Link style={{margin: '10px'}} to='/'>Home</Link>
            <Link style={{margin: '10px'}} to='/pizza'>Order Pizza</Link>
          </div>
        </nav>
        {/* With Route, if URL in Chrome matches the "path" prop we gave the Route, then, the nested renders */}
      <Switch>
        <Route path='/pizza'>
          <PizzaForm
            values={formValues}
            change={onInputChange}
            checkboxChange={onCheckboxChange}
            submit={onSubmit}
            disabled={disabled}
            errors={error}
          />
        </Route>

        <Route path="/">
          <Home orders={pizzaOrderList}/>
        </Route>
      </Switch>
    </div>
  );
}
  export default App;
