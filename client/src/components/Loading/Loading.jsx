import './loading.css';

const Loading = ({ loadingMessage }) => {

    return (
        <div id="loading-container">
            <h1>{loadingMessage}</h1>
            <img src="/assets/Loading_Your_Platform.gif" alt="loading gif" />
        </div>
    )
}

export default Loading;
