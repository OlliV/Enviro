import Line from '../components/line'

export default () => (
	<div>
		<div className="container">
			<Line />
			<Line />
		</div>
		<style jsx>{`
			.container {
				height: 100vh;
				width: 100vw;
				display: grid;
				text-align: center;
				justify-content: center;
				align-items: center;
			}
		`}</style>
	</div>
)
