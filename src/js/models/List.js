import uniqid from 'uniqid';
export default class List {
    constructor () {
        this.items = [];
    }


    addItem (count,unit, ingredient) {
        
        const item = {
            id: uniqid(), //Third party library will assign a new Unique item
            count,
            unit,
            ingredient,
        }
        this.items.push(item);
        return item;
    };

    deleteItem(id) {
        //Finding the index of the element we need
        //The call back function, returns true and then allows findIndex, to give the index
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    };

    updateCount(id, newCount) {
        //This is used to find the Element and assign the new Count to it
        this.items.find(el => el.id === id).count = new Count;
    };
};