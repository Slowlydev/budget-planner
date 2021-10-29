import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import nookies from "nookies";

import { adminApp } from "../firebaseAdmin";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";

import Container from "../components/Container";
import Navbar from "../components/Navbar";

export default function Budgetlist(props) {
  const [data, setData] = useState();

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [expenseArray, setExpenseArray] = useState([]);

  let totalItemsCost = 0;

  const addTotalCost = (value) => {
    totalItemsCost = totalItemsCost + value;
  };

  firebaseClient();

  useEffect(() => {
    function loadInputs(dataTemp) {
      const loadArray = [];

      if (dataTemp) {
        setIncome(dataTemp.montlyIncome);

        if (dataTemp.expenseArray) {
          for (const item of dataTemp.expenseArray) {
            loadArray.push(item);
          }
        }
      }

      if (loadArray.length !== 0) {
        setExpenseArray(loadArray);
        setExpense(calcAll(loadArray));
      }
    }

    firebase
      .database()
      .ref(`users/${props.session}/`)
      .on("value", function (returnedData) {
        try {
          setData(returnedData.val());
          loadInputs(returnedData.val());
        } catch (err) {
          console.error(err);
        }
      });
  }, [props.session]);

  const items = [];

  if (data && data.items) {
    for (const key in data.items) {
      if (data.items[key].inBudgetList) {
        items.push(data.items[key]);
        addTotalCost(data.items[key].cost);
      }
    }
  }

  function calcAll(array) {
    let allCost = 0;

    for (const item of array) {
      allCost = allCost + parseFloat(item.cost);
    }

    return allCost;
  }

  function updateDB() {
    firebase
      .database()
      .ref(`users/${props.session}`)
      .update({
        montlyIncome: parseFloat(income),
        montlyExpenses: parseFloat(calcAll(expenseArray)),
        expenseArray: expenseArray,
      });
  }

  function calculateMonth(cost) {
    const sparquote = data.montlyIncome - data.montlyExpenses;
    const nMonate = cost / sparquote;

    return nMonate;
  }

  function update(value, index, prop) {
    let tempArray = expenseArray;
    let tempItem = { ...tempArray[index] };

    tempItem[prop] = value;
    tempArray[index] = tempItem;

    setExpenseArray(tempArray);
    setExpense(calcAll(tempArray));
  }

  function add() {
    setExpenseArray([...expenseArray, { name: "", cost: 0 }]);
  }

  function remove(index) {
    let tempArray = expenseArray;

    tempArray.splice(index, 1);

    setExpenseArray(tempArray);
    setExpense(calcAll(tempArray));
  }

  function calcDiff() {
    return income - expense;
  }

  function calcDate(itemDate, cost, toggle) {

    const dateAdded = new Date(itemDate).getTime();
    const dateNow = Date.now();
    const diffMonths = 2629743000 * calculateMonth(cost);

    const unixWhenGettable = dateAdded + diffMonths;
    const daysUntilGettable = (unixWhenGettable - dateNow) / 86400000;

    if (toggle) {
      return new Date(unixWhenGettable).toLocaleDateString()
    } else {
      return Number.parseInt(daysUntilGettable)
    }
  }

  if (props.session && data && data.items && data.montlyIncome && data.montlyExpenses) {
    return (
      <Container navbar>
        <h1>Budgetlist</h1>
        <div className="side-bar">
          <h2>Your Budget</h2>
          <p>Monthly Income</p>
          <motion.input onChange={(e) => setIncome(e.target.value)} placeholder={income ? income : "Monthly Income"} type="number" step="10" whileFocus={{ scale: 1.1 }} />
          <p>Monthly Expenses</p>
          <div className="col">
            {expenseArray.map((expense, index) => (
              <div className="input-row" key={index}>
                <motion.input onChange={(e) => update(e.target.value, index, "name")} placeholder={expense.name ? expense.name : "Expense Name"} whileFocus={{ scale: 1.1 }} />
                <div className="splitter" />
                <motion.input onChange={(e) => update(e.target.value, index, "cost")} placeholder={expense.cost ? expense.cost : "Expense Cost"} type="number" whileFocus={{ scale: 1.1 }} />
                <div className="splitter" />
                <motion.button className="red smal" onClick={() => remove(index)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>remove</motion.button>
              </div>
            ))}
            {!expenseArray && (
              <p>no expenses found add one with the button below</p>
            )}
          </div>

          <div className="expense-info">
            {!!expense && (
              <p>Total Montly Expenses: {calcAll(expenseArray)}</p>
            )}
            {!!income && !!expense && (
              <p>Montly &quot;spendable&quot; amount: {calcDiff()}</p>
            )}
          </div>

          <motion.button onClick={add} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Add expense
          </motion.button>
          <motion.button disabled={!expense || !income} onClick={updateDB} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Update
          </motion.button>
        </div>

        <p>To buy all items in your list u would have to save for {calculateMonth(totalItemsCost)} months!</p>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Date Added</th>
              <th>Date u can buy</th>
              <th>In Days</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td className="number">{item.cost}</td>
                <td>{new Date(item.dateAdded).toLocaleDateString()}</td>
                <td>{calcDate(item.dateAdded, item.cost, true)}</td>
                <td>{calcDate(item.dateAdded, item.cost)}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </Container>
    );
  } else {
    return (
      <Container>
        <Navbar />
        <h1>Budgetlist</h1>
        <div className="side-bar">
          <h2>Your Budget</h2>
          <p>Monthly Income</p>
          <motion.input onChange={(e) => setIncome(e.target.value)} placeholder={income ? income : "Monthly Income"} type="number" step="10" whileFocus={{ scale: 1.1 }}
          />
          <p>Monthly Expenses</p>
          <div className="col">
            {expenseArray.map((expense, index) => (
              <div className="input-row" key={index}>
                <motion.input onChange={(e) => update(e.target.value, index, "name")} placeholder={expense.name ? expense.name : "Expense Name"} whileFocus={{ scale: 1.1 }} />
                <div className="splitter" />
                <motion.input onChange={(e) => update(e.target.value, index, "cost")} placeholder={expense.cost ? expense.cost : "Expense Cost"} type="number" whileFocus={{ scale: 1.1 }} />
                <div className="splitter" />
                <motion.button className="red smal" onClick={() => remove(index)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>remove</motion.button>
              </div>
            ))}
            {!expenseArray.length && (
              <p>no expenses found add one with the button below</p>
            )}
          </div>

          <div className="expense-info">
            {!!expense && (
              <p>Total Montly Expenses: {calcAll(expenseArray)}</p>
            )}
            {!!income && !!expense && (
              <p>Montly &quot;spendable&quot; amount: {calcDiff()}</p>
            )}
          </div>

          <motion.button onClick={add} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Add expense
          </motion.button>
          <motion.button disabled={!expense || !income} onClick={updateDB} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Update
          </motion.button>
        </div>
        <h1>Loading...</h1>
        <p>It could be that u dont have any items yet, go to the wishlist and add some :)</p>
        <p>or u maybe need to fil in your expenses/income, or if u did that go ahead and press the upload button</p>
      </Container>
    );
  }
}

export async function getServerSideProps(context) {
  try {
    const cookies = nookies.get(context);
    const token = await adminApp().auth().verifyIdToken(cookies.token);
    const { uid } = token;

    return {
      props: { session: uid }
    };
  } catch (err) {
    context.res.writeHead(302, { Location: "/" });
    context.res.end();

    return { props: {} };
  }
}
