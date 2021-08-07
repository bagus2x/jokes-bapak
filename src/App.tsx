import React, { useEffect, useState } from 'react';
import style from './App.module.css';

interface Joke {
	id: string;
	joke: string;
}

const getJoke = (): Promise<Joke> => {
	return fetch('https://icanhazdadjoke.com/', {
		headers: {
			Accept: 'application/json'
		}
	}).then((res) => res.json());
};

const useDadJoke = () => {
	const [joke, setJoke] = useState<Joke | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const refetch = () => {
		setError(null);
		setJoke(null);
		getJoke()
			.then((res) => setJoke(res))
			.catch((err) => setError(err));
	};

	useEffect(() => {
		refetch();
	}, []);

	return {
		joke,
		error,
		isLoading: !joke && !error,
		isError: !!error,
		isSuccess: !!joke,
		refetch
	};
};

function App() {
	const { joke, error, isError, isLoading, isSuccess, refetch } = useDadJoke();

	useEffect(() => {
		if (isError) alert(error?.message);
	}, [isError, error]);

	return (
		<div className={style.container}>
			<div className={style.jokeWrapper}>
				{isSuccess && <span>{joke?.joke}</span>}
				{isLoading && <span>Loading...</span>}
			</div>
			<button disabled={isLoading} className={style.btnRefresh} onClick={refetch}>
				Refresh
			</button>
		</div>
	);
}

export default App;
