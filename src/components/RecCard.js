import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

function RecCard({ index, type }) {
  const [recomendationDrink, setRecomendationDrink] = useState({});
  const [recomendationFood, setRecomendationFood] = useState({});

  async function recFoodsAPI() {
    const request = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const response = await request.json();
    const info = response.meals;
    setRecomendationFood(info[index]);
  }

  async function recDrinksAPI() {
    const request = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
    const response = await request.json();
    const info = response.drinks;
    setRecomendationDrink(info[index]);
  }

  useEffect(() => {
    recDrinksAPI();
    recFoodsAPI();
  }, []);

  return (
    <div>
      {(type === 'drink')
        ? (
          <div
            data-testid={ `${index}-recomendation-card` }
            key={ index }
          >
            <img
              src={ recomendationFood.strMealThumb }
              alt={ recomendationFood.strMeal }
            />
            <p>{recomendationFood.strCategory}</p>
            <h5 data-testid={ `${index}-recomendation-title` }>
              {recomendationFood.strMeal}
            </h5>
          </div>
        )
        : (
          <div data-testid={ `${index}-recomendation-card` } key={ index }>
            <img
              src={ recomendationDrink.strDrinkThumb }
              alt={ recomendationDrink.strDrink }
            />
            <p>{recomendationDrink.strCategory}</p>
            <h5 data-testid={ `${index}-recomendation-card` }>
              {recomendationDrink.strDrink}
            </h5>
          </div>
        )}
    </div>
  );
}

export default RecCard;

RecCard.propTypes = {
  index: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
