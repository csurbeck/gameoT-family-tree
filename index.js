/**
 * Name: Claire Surbeck
 * Date: October 23, 2022
 * Section: CSE 154 AA
 *
 *This is the index.js document that is used to add the user interactivity to my gallery generator
 * website where users can select pieces of art to be appended into their specifically-curated
 * gallery, where then they can experiment with framing styles.
 */

'use strict';
(function() {

  const GOT_API_URL = 'https://anapioficeandfire.com/api/characters';

  const MALE_CHARACTERS = [208, 217, 1298, 1319, 339, 1418, 1445, 529, 565, 583, 1560, 1346, 823,
  849, 1880, 901, 954, 955, 1963, 1022, 1029, 2024, 1052, 27];
  const FEMALE_CHARACTERS = [148, 216, 232, 238, 1303, 16, 743, 1709, 957, 2126, 1427, 364];
  let isSmall = true;
  let isMale = true;

  window.addEventListener('load', init);

  /**
   * Initializing function: added eventListners to buttons and radio buttons
   */
  function init() {
    let radioBtns = qsa("input");
    for (let i = 0; i < radioBtns.length; i++) {
      radioBtns[i].addEventListener("change", checkGenConditions);
    }
    id("generate-btn").addEventListener("click", toggleViews);
    id("generate-btn").addEventListener("click", function() {
      generateTree();
    });
    id("back-btn").addEventListener("click", toggleViews);
  }

  /**
   * Checks the value of the radio button that was checked and appropriatly changes the global
   * module variable values to reflect the user specifications of the family tree that they want
   * to generate and determines which levels of the family tree will stay hidden or not.
   */
  function checkGenConditions() {
    if (qs('input[name="size"]:checked').value !== null) {
      let answer = qs('input[name="size"]:checked').value;
      isSmall = false;
      if (answer === "small") {
        isSmall = true;
      }
      if (isSmall === false) {
        let biggerFamily = qsa(".size-hidden");
        for (let i = 0; i < biggerFamily.length; i++) {
          biggerFamily[i].classList.remove('size-hidden');
        }
      }
    }

    if (qs('input[name="gender"]:checked').value !== null) {
      let answer2 = qs('input[name="gender"]:checked').value;
      isMale = false;
      if (answer2 === "male") {
        isMale = true;
      }
    }
  }

  /**
   * Switches between the menu view and the tree view
   */
  function toggleViews() {
    let notCurrentPage = qs('.hidden');
    let menuView = id("menu-view");
    let treeView = id("tree-view");
    if (notCurrentPage === menuView) {
      menuView.classList.remove('hidden');
      treeView.classList.add('hidden');
    } else {
      menuView.classList.add('hidden');
      treeView.classList.remove('hidden');
      id("grandparents").innerHTML = "";
      id("parents").innerHTML = "";
      id("kids").innerHTML = "";
      id("grandkids").innerHTML = "";
    }
  }

  /**
   * calls for cards to be generated for kids and parents, and then additionally grandparents and
   * grandkids if building a big tree
   */
  function generateTree() {
    generateCouple("parents");
    generateKids("kids");
    if (isSmall === false) {
      generateCouple("grandparents");
      generateCouple("grandparents");
      generateKids("grandkids");
    }
  }

  /**
   * randomly generates the API number of a male character and a female character, fetchs it from
   * the API and turns it into a character card, which is appended to a `div` and returned.
   * @param {String} tier - indicates which tier of the family tree to add this character card to
   */
  function generateCouple(tier) {
    let ranFemale = Math.floor(Math.random() * FEMALE_CHARACTERS.length);
    let ranMale = Math.floor(Math.random() * MALE_CHARACTERS.length);

    generateGuy(ranMale, tier, false);
    generateGirl(ranFemale, tier, false);

  }

  /**
   * generates three character cards for the kids or grandkids portion of the family tree.
   * especially constructs a character yard to represent the user.
   * @param {String} tier - indicates which level of family tree to place character card at
   */
  function generateKids(tier) {
    let ranFemale = Math.floor(Math.random() * FEMALE_CHARACTERS.length);
    generateGirl(ranFemale, tier, false);

    if (tier === "kids") {
      if (isMale === true) {
        let you = Math.floor(Math.random() * MALE_CHARACTERS.length);
        generateGuy(you, tier, true);
      } else {
        let you = Math.floor(Math.random() * FEMALE_CHARACTERS.length);
        generateGirl(you, tier, true);
      }
    } else {
      let ranMale = Math.floor(Math.random() * MALE_CHARACTERS.length);
      generateGuy(ranMale, tier, false);
    }
    let ranMale = Math.floor(Math.random() * MALE_CHARACTERS.length);
    generateGuy(ranMale, tier, false);
  }

  /**
   * generates a random male character
   * @param {Integer} num - random number to generate character
   * @param {String} tier - indicates where in HTML to append the character
   * @param {boolean} isYou - signifies if this character will represent the user
   */
  function generateGuy(num, tier, isYou) {
    fetch(GOT_API_URL + '/' + MALE_CHARACTERS[num])
      .then(statusCheck)
      .then(res => res.json())
      .then(function(someVal) {
        return createCharCard(someVal, tier, isYou);
      })
      .catch(handleError);
  }

  /**
   * generates a random female character
   * @param {int} num - random number to generate character
   * @param {String} tier - indicates where in HTML to append the character
   * @param {boolean} isYou - signifies if this character will represent the user
   */
  function generateGirl(num, tier, isYou) {
    fetch(GOT_API_URL + '/' + FEMALE_CHARACTERS[num])
      .then(statusCheck)
      .then(res => res.json())
      .then(function(someVal) {
        return createCharCard(someVal, tier, isYou);
      })
      .catch(handleError);
  }

  /**
   * creates a character card including an image of the character and their name
   * @param {JSON} character - JSON object of the character retrieved from the API URL
   * @returns {tier} - indicates which tier of the faimly tree the character card is
   * @return {boolean} isYou - true if the character will represent user, false if not
   */
  function createCharCard(character, tier, isYou) {
    let charCard = gen("article");
    let charImage = gen("img");
    let namePlate = gen("p");
    let lowercaseName = character.name.toLowerCase();
    let charName = lowercaseName.split(" ");
    let charDescript = charName[0];
    for (let i = 1; i < charName.length; i++) {
      charDescript += "-" + charName[i];
    }
    charImage.src += "img/" + charDescript + ".jpeg";
    charCard.setAttribute("id", "" + charDescript);
    charImage.alt = "" + character.name;
    namePlate.textContent = "" + character.name;
    charCard.appendChild(charImage);
    charCard.appendChild(namePlate);
    if (isYou === true) {
      charCard.classList.add('you');
      namePlate.textContent += " (YOU)";
    }
    id("" + tier).appendChild(charCard);
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * handles errors in the .then chain loop
   */
  function handleError() {
    console.log("error");
  }

  /**
   * retrieves an HTML element by ID
   * @param {String} id - the id tag for an element in the HTML
   * @returns {Node} - the element from the HTML document
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * retrieves an HTML element by the selector parameter passed in
   * @param {String} selector - the selector id for elements in the HTML document
   * @returns {Node} - the element from the HTML document
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * retrieves an array of HTML elements that contains the selector parameter passed in
   * @param {String} selector - the selector tag for elements in the HTML document
   * @return {NodeList} - an array with the elements from the HTML document with the selector tag
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * creates a new HTML element of specific type
   * @param {String} tag - the name of the type of HTML tag that the user wants to generate
   * @returns the user-specified HTML element
   */
  function gen(tag) {
    return document.createElement(tag);
  }
})();