function TopCategories({ expenses }) {

  const categoryTotals = {};

  expenses
    .filter((item) => item.type === "Expense")
    .forEach((expense) => {

      const category = expense.category || "Other";

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] += Number(expense.amount);
    });


  const categories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);


  return (
    <div className="top-categories">

      <h2>🏆 Top Spending Categories</h2>

      {categories.length === 0 ? (

        <p>No expense data available.</p>

      ) : (

        <div className="top-category-list">

          {categories.map(
            ([category, amount], index) => (

              <div
                className="top-category-item"
                key={category}
              >

                <div className="category-rank">
                  #{index + 1}
                </div>

                <div className="category-info">

                  <h4>{category}</h4>

                  <div className="category-bar">

                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${
                          (amount / categories[0][1]) * 100
                        }%`
                      }}
                    ></div>

                  </div>

                </div>

                <strong>
                  ₹{amount}
                </strong>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default TopCategories;