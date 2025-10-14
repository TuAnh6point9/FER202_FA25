// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import HomeCarousel from "../components/HomeCarousel";
import MovieCardGrid from "../components/MovieCardGrid";
import Filter from "../components/Filter";
import NavBar from "../components/NavBar";
import ProfileWizard from "../components/ProfileWizard";
import FavouritesModal from "../components/FavouritesModal";

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [yearRange, setYearRange] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [account, setAccount] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('account');
    if (saved) setAccount(JSON.parse(saved));
    else setShowSignIn(true); // auto open sign in at first load
  }, []);

  function handleSignInFinish(data){
    if (!data) { setShowSignIn(false); return; }
    // minimal mock: consider logged in if username exists or firstName exists
    const acc = { username: data.username || `${data.firstName||'user'}` };
    setAccount(acc);
    localStorage.setItem('account', JSON.stringify(acc));
    setShowSignIn(false);
  }

  function handleLogout(){
    setAccount(null);
    localStorage.removeItem('account');
  }

  return (
    <div>
  <NavBar
        onQuickSearch={(q) => setSearch(q || '')}
        isLoggedIn={!!account}
        onLogin={() => setShowSignIn(true)}
        onLogout={handleLogout}
        onShowFavourites={() => setShowFavs(true)}
      />
      <HomeCarousel />
      {/* Filter card */}
      <div className="container mt-3">
        <Filter
          search={search}
          setSearch={setSearch}
          yearRange={yearRange}
          setYearRange={setYearRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="mt-2">
          <h4>Featured Movies Collections</h4>
          <p className="text-secondary">Thêm thông tin về các bộ sưu tập phim nổi bật ở đây.</p>
          <MovieCardGrid search={search} yearRange={yearRange} sortBy={sortBy} />
        </div>
      </div>

      {/* Sign In Wizard */}
      {showSignIn && (
        <ProfileWizard show={showSignIn} onClose={()=>setShowSignIn(false)} onFinish={handleSignInFinish} />
      )}

      {/* Favourites modal */}
      <FavouritesModal show={showFavs} onHide={() => setShowFavs(false)} />
    </div>
  );
}

