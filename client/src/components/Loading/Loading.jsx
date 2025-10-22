import './loading.css';

const Loading = ({ loadingMessage }) => {

    return (
        <div id="loading-container">
            <h1>{loadingMessage}</h1>
            <img src="/assets/coffee-time-loading.gif" alt="loading gif" />
        </div>
    )
}

export default Loading;
