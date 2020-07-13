import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
// import Likes from './models/Likes';


import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


import { elements, renderLoader, clearLoader, elementStrings } from './views/base';
/** Global State of the app
 * - Search Object 
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */
const state = {};
/**
 * SEARCH CONTROLLER
 */

const controlSearch =  async () => {
    // 1. Get the query from the view (UI)
    const query = searchView.getInput(); // TO DO 

    if(query){
        // 2. New Search object and add to app state
        state.search = new Search(query);
        
        // 3. Prepare the UI For Results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try{
            // 4. Search for Recipes
            await state.search.getResults();
    
    
            // 5. Render results on the UI (After Recieiving the results)
            clearLoader();
            searchView.renderResults(state.search.results);

        }catch(error){
            alert('Error getting searched item');
            clearLoader();
        }

    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.results, goToPage);
    }

});


/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    //GET ID From URL
    const id = window.location.hash.replace('#', '');
    
    if(id){
        //PREPARE  UI FOR CHANGES
        recipeView.clearRecipe();``
        renderLoader(elements.recipe);

        //HighLight Selected search item
        if (state.search){
            searchView.highlightSelected(id);
        };    
        //Create new recipe object
        state.recipe = new Recipe(id);

        try{
            //Get recipe object and parse ingregident
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate Servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            //Render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        }catch (error){
            alert('Error processing recipe!');
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    //Create a New list, if there is none yet
    if(!state.list){
        state.list = new List();
    };
    //Add each Ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    }); 
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e=> {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //Handle the Delete Button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //Delete from State
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);

        //Handle the count Update
    }else if(e.target.matches(".shopping__count-value")){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});

/**
 * LIKE CONTROLLER
 */
//Testing 


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has not yet liked the current recipe
    if (!state.likes.isLiked(currentID)){
    //Add Like to the state
    const newLike = state.likes.addLike(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.img
    );

    //Toggle the like button
        likesView.toggleLikeBtn(true);

    //Add the recipe to the UI List
    likesView.renderLike(newLike);

    //User has liked the current recipe
    } else{
        //remove like from State
        state.likes.deleteLike(currentID);

        //Remove the Toggle on like button
        likesView.toggleLikeBtn(false);


        //Remove the liked recipe from the UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restor Liked Recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();

    // Toggle Likes Menu Button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach( like => {
      likesView.renderLike(like);
    })
});


// Handlings Recipe buttons clicks
elements.recipe.addEventListener('click' , e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        //Increase Button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add Ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Powers ON the like Controller
        controlLike();
    }

});



