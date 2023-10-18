const userCards = document.getElementById("user-cards");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");

// Function to fetch followers
async function fetchFollowers(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/followers`);
    if (response.ok) {
      const followersData = await response.json();
      return followersData;
    }
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}

// Function to create a user card
function createUserCard(user) {
  const card = document.createElement("div");
  card.classList.add("user-card");

  card.innerHTML = `
        <div class="user-profile">
         <a href="${user.html_url}" target="_blank">
            <img src="${user.avatar_url}" alt="${user.login}" class="user-image">
         </a>
            <div class="user-name">${user.login}</div>
        </div>
        <div class="followers-reveal-button">
            <div class="user-followers">Followers</div>
            <button class="reveal-btn" value="true">Reveal</button>
        </div>
        <ul class="followers-list">
          <li><a><img></a></li>
          <li><a><img></a></li>
          <li><a><img></a></li>
        </ul>
    `;
  return card;
}
// Search user-card using filter method
function filterUserCards(searchText) {
  const userCards = document.querySelectorAll(".user-card");
  userCards.forEach((card) => {
    const userName = card.querySelector(".user-name").textContent;
    if (userName.toLowerCase().includes(searchText.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Function to create a follower element
function createUserFollower(follower) {
  const followerItem = document.createElement("li");
  const followerLink = document.createElement("a");
  const followerImage = document.createElement("img");

  followerLink.href = follower.html_url;
  followerLink.target = "_blank";
  followerImage.src = follower.avatar_url;

  followerLink.appendChild(followerImage);
  followerItem.appendChild(followerLink);

  return followerItem;
}

// Functions
// update follower list
function updateFollowersList(followersList, followersData, revealBtn) {
  if (revealBtn.textContent === "Reveal") {
    followersList.innerHTML = "";
    followersData.slice(0, 3).forEach((follower) => {
      const followerItem = createUserFollower(follower);
      followersList.appendChild(followerItem);
    });
    revealBtn.textContent = "Revealed";
    revealBtn.style.backgroundColor = '#60b347';
  } else {
    followersList.innerHTML = "";
    followersData.slice(0, 3).forEach((follower) => {
      const followerItem = document.createElement("li");
      const followerLink = document.createElement("a");
      const followerImage = document.createElement("img");
      followerLink.appendChild(followerImage);
      followerItem.appendChild(followerLink);
      followersList.appendChild(followerItem);
    });
    revealBtn.textContent = "Reveal";
    revealBtn.style.backgroundColor = '#5f5ff1';
  }
}

//  Reveal button handler
function handleRevealButton(revealBtn, followersList, username) {
  revealBtn.addEventListener("click", async () => {
    // Check if followers data is available in local storage
    const cachedFollowersData = localStorage.getItem(`followersData_${username}`);

    if (cachedFollowersData) {
      const followersData = JSON.parse(cachedFollowersData);
      updateFollowersList(followersList, followersData, revealBtn);
    }
    // Followers data can't fetch from local storage and fetch from api
    else {
      const followersData = await fetchFollowers(username);

      // Store followers data in local storage 
      localStorage.setItem(`followersData_${username}`, JSON.stringify(followersData));

      updateFollowersList(followersList, followersData, revealBtn);
    }
  });
}

// Function to create and display user cards
async function createUserCards() {
  try {
    // Check if data is available in local storage
    const cachedData = localStorage.getItem('userCardsData');

    if (cachedData) {
      const usersData = JSON.parse(cachedData);
      for (const user of usersData) {
        const card = createUserCard(user);
        userCards.appendChild(card);
        const followersList = card.querySelector(".followers-list");
        const revealBtn = card.querySelector(".reveal-btn");
        handleRevealButton(revealBtn, followersList, user.login);
      }
    }
    else {
      // Data is not available in local storage
      const usersResponse = await fetch("../data.json");
      const usersData = await usersResponse.json();

      // Update local storage and Store the fetched data in local storage 
      localStorage.setItem('userCardsData', JSON.stringify(usersData));

      for (const user of usersData) {
        const card = createUserCard(user);
        userCards.appendChild(card);
        const followersList = card.querySelector(".followers-list");
        const revealBtn = card.querySelector(".reveal-btn");
        handleRevealButton(revealBtn, followersList, user.login);
      }
    }
    searchInput.addEventListener("input", (e) => {
      filterUserCards(e.target.value);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
createUserCards();