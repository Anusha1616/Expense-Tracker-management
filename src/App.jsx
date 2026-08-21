import Header from "./components/Header";
import Balance from "./components/Balance";
import Income from "./components/Income";
import Expense from "./components/Expense";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Header />
      <Balance />
      <Income />
      <Expense />
      <AddExpenseForm />
      <ExpenseList />
      <Footer />
    </div>
  );
}

export default App;