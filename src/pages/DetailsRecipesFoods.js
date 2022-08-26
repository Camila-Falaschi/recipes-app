import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from '../AppContext/AppContext';
import CarouselDrinks from '../components/CarouselDrinks';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import './DetailsRecipes.css';

const copy = require('clipboard-copy');

export default function DetailsRecipesFoods() {
  const { id, setId, data, setData, ingredientList, setIngedientList,
    measureList, setMeasureList, recipeBtn, setRecipeBtn, inProgressRecipes,
    setInProgressRecipes, setDoneRecipes } = useContext(AppContext);

  const [videoURL, setVideoURL] = useState('');
  const [isLinkCopied, setIsLinkCopied] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const history = useHistory();
  const { pathname } = window.location;

  const foodIdAPI = async (foodID) => {
    const request = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodID}`);
    const response = await request.json();
    setData(...response.meals);
    const info = response.meals[0];

    const url = info.strYoutube.split('=');
    setVideoURL(url[1]);

    const ingredient = Object.entries(info).filter((e) => e[0].includes('strIngredient'));
    const ingListFilter = ingredient.map((e) => e.slice(1))
      .filter((it) => it[0] !== '' && it[0] !== null);
    setIngedientList(ingListFilter);

    const measure = Object.entries(info).filter((e) => e[0].includes('strMeasure'));
    const meListFilter = measure.map((e) => e.slice(1))
      .filter((it) => it[0] !== '' && it[0] !== null);
    setMeasureList(meListFilter);
  };

  useEffect(() => {
    const strings = pathname.split('/');
    setId(strings[2]);
    foodIdAPI(strings[2]);

    const verifyFav = localStorage.getItem('favoriteRecipes');
    if (verifyFav !== null) {
      const array = JSON.parse(verifyFav);
      const checkFav = array.some((el) => el.id === strings[2]);
      setIsFavorite(checkFav);
    }
  }, []);

  useEffect(() => {
    const dnRecipes = localStorage.getItem('doneRecipes');
    if (dnRecipes === null) {
      return localStorage.setItem('doneRecipes', '[]');
    }
    const array = JSON.parse(dnRecipes);

    const isDone = array.some((it) => it.id === id);
    if (isDone) {
      setRecipeBtn(false);
    }

    return setDoneRecipes(array);
  }, []);

  useEffect(() => {
    const progRecipes = localStorage.getItem('inProgressRecipes');
    if (progRecipes === null) {
      return localStorage.setItem('inProgressRecipes', '{}');
    }
    const obj = JSON.parse(progRecipes);
    return setInProgressRecipes(obj);
  }, []);

  const handleAddFav = () => {
    const favRecipes = localStorage.getItem('favoriteRecipes');

    const newFav = [{
      id: data.idMeal,
      type: 'food',
      nationality: data.strArea,
      category: data.strCategory,
      alcoholicOrNot: '',
      name: data.strMeal,
      image: data.strMealThumb,
    }];

    if (favRecipes === null) {
      return localStorage.setItem('favoriteRecipes', JSON.stringify(newFav));
    }

    const array = JSON.parse(favRecipes);
    const newFavList = [...array, ...newFav];

    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavList));
  };

  const handleRemoveFav = () => {
    const favRecipes = localStorage.getItem('favoriteRecipes');
    const array = JSON.parse(favRecipes);

    const newArray = array.filter((ele) => ele.id !== id);

    localStorage.setItem('favoriteRecipes', JSON.stringify(newArray));
  };

  const handleFavoriteBtn = () => {
    setIsFavorite(!isFavorite);

    if (isFavorite) {
      handleRemoveFav();
    }
    if (!isFavorite) {
      handleAddFav();
    }
  };

  return (
    <div>
      <img
        src={ data.strMealThumb }
        alt={ data.strMeal }
        data-testid="recipe-photo"
      />
      <h1 data-testid="recipe-title">{ data.strMeal }</h1>
      <div>
        <button
          type="button"
          onClick={ () => {
            copy(`http://localhost:3000${pathname}`);
            setIsLinkCopied(false);
          } }
        >
          <img
            data-testid="share-btn"
            src={ shareIcon }
            alt="A button that share the recipe"
          />
        </button>
        <p hidden={ isLinkCopied }>Link copied!</p>
        <button
          type="button"
          onClick={ () => handleFavoriteBtn() }
        >
          <img
            data-testid="favorite-btn"
            src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
            alt="A button that favorite the recipe"
          />
        </button>
      </div>
      <h3 data-testid="recipe-category">
        Categoria:
        {''}
        { data.strCategory }
      </h3>
      <div>
        <h3>
          Ingredientes
        </h3>
        <ol>
          {ingredientList.map((item, index) => (
            <li key={ item } data-testid={ `${index}-ingredient-name-and-measure` }>
              {item}
              {' '}
              -
              {' '}
              {measureList[index]}
            </li>
          ))}
        </ol>
      </div>
      <p data-testid="instructions">{ data.strInstructions }</p>
      <iframe
        data-testid="video"
        width="560"
        height="315"
        src={ `https://www.youtube.com/embed/${videoURL}` }
        title="YouTube video player"
        frameBorder="0"
        allowFullScreen
      />
      <div>
        <h3>
          Recomendações
        </h3>
        <CarouselDrinks />
      </div>
      {
        recipeBtn
        && (
          <button
            className="recipeBtn"
            type="button"
            data-testid="start-recipe-btn"
            onClick={ () => { history.push(`/foods/${id}/in-progress`); } }
          >
            {
              (inProgressRecipes.meals === undefined)
                ? 'Start Recipe'
                : (
                  Object.keys(inProgressRecipes.meals)
                    .some((recipeID) => recipeID === id) && 'Continue Recipe')
            }
          </button>)
      }
    </div>
  );
}