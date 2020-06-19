
import React, { useState, useEffect } from 'react'
// 👉 STEP 2 - React Router imports
import { Switch, Route, Link } from 'react-router-dom'
import './App.css';
import axios from 'axios'
import * as Yup from 'yup'
import PizzaForm from './PizzaForm'
import PizzaSchema from './PizzaSchema'
import Pizza from './Pizza'

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
  const [disabled, setdisabled] = useState(firstDisabled);
  const [error, setError] = useState(firstErrors);
  const [pizzaOrder, setPizzaOrder] = useState(firstPizzaOrder);

  // useEffect(() => {
  //   fetchStock().then(res => setStock(res.data))
  // }, [])

  const onInputChange = evt => {
    let { name, value } = evt.target;
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

    setFormValues({
      ...formValues,
      [name]: value // NOT AN ARRAY
    })
  }

  const onCheckboxChange = evt => {
    const { name, checked } = evt.target
    Yup
      .reach(PizzaSchema, name)
      //we can then run validate using the value
      .validate(checked)
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

    setFormValues({
      ...formValues,
      [name]: checked // NOT AN ARRAY
    })
  }

  const onSubmit = evt => {
    evt.preventDefault();
    const newPizza = {
      ...formValues, ordered: true
    }
    setPizzaOrder(newPizza);

    useEffect(() => {
      FormSchema.isValid(formValues).then(valid => {
        console.log('valid: ' + valid);
        setDisabled(!valid);
      })
    }, [formValues])

    return (
      <div className='App'>
        <h1>Lambda Eats</h1>
        <nav>
          <div className='nav-links'>
            {/* 👉 STEP 3 - Make Links to navigate us Home (`/`) and Shop (`/items-list`) */}
            <Link to='/'>Home</Link>
            <Link to='/pizza'>Order Pizza</Link>
          </div>
        </nav>
        <Switch>
          {/* With Route, if URL in Chrome matches the "path" prop we gave the Route, then, the nested renders */}

          <Route path='/pizza'>
            <PizzaForm
              values={formValues}
              change={onInputChange}
              checkboxChange={onCheckboxChange}
              submit={onSubmit}
              disabled={disabled}
              errors={error}
              pizzaOrder={pizzaOrder}
            />
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    );
  };
  export default App;
