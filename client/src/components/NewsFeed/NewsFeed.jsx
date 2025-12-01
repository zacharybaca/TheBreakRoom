import './news-feed.css';

const NewsFeed = () => {
  return (
    <div id="news-feed">
      <header className="nf-header">
        <h1>News Feed</h1>
      </header>

      <section className="nf-composer">
        <textarea
          className="nf-input"
          placeholder="Share an update..."
        />
        <button className="nf-submit">Post</button>
      </section>

      <section className="nf-list">
        <article className="nf-item">Example post 1</article>
        <article className="nf-item">Example post 2</article>
        <article className="nf-item">Example post 3</article>
      </section>
    </div>
  );
};

export default NewsFeed;
