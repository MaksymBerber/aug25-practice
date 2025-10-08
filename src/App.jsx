/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useMemo } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const products = useMemo(() => {
    return productsFromServer.map(product => {
      const category = categoriesFromServer.find(
        c => c.id === product.categoryId
      );
      const user = usersFromServer.find(
        u => u.id === category.ownerId
      );

      return {
        ...product,
        category,
        user,
      };
    });
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter(product => {
      const matchesUser =
        selectedUserId === null || product.user.id === selectedUserId;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesUser && matchesSearch;
    });
  }, [products, selectedUserId, searchQuery]);

  const resetFilters = () => {
    setSelectedUserId(null);
    setSearchQuery('');
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => setSearchQuery('');

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === null ? 'is-active' : ''}
                onClick={() => setSelectedUserId(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUserId === user.id ? 'is-active' : ''}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchQuery && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearSearch}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                >
                  {`${category.icon} - ${category.title}`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <button
                data-cy="ResetAllButton"
                type="button"
                onClick={resetFilters}
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>User</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td
                      className="has-text-weight-bold"
                      data-cy="ProductId"
                    >
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>

                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
