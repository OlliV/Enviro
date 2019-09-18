import { ResponsiveLine } from '@nivo/line';

export default ({series, name}) => {
	return (
		<div className="line">
			<ResponsiveLine
				data={series}
				margin={{ top: 50, right: 110, bottom: 110, left: 60 }}
				xScale={{
					type: 'point'
				}}
				yScale={{
					type: 'linear',
					stacked: false,
					min: 'auto',
					max: 'auto'
				}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					orient: 'bottom',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: -45,
					legend: 'time',
					legendOffset: 85,
					legendPosition: 'middle'
				}}
				axisLeft={{
					orient: 'left',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'value',
					legendOffset: -40,
					legendPosition: 'middle'
				}}
				colors={{ scheme: 'nivo' }}
				pointSize={10}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={2}
				pointBorderColor={{ from: 'serieColor' }}
				pointLabel="y"
				pointLabelYOffset={-12}
				crosshairType="cross"
				useMesh={true}
				legends={series.length > 0 ? [
					{
						anchor: 'bottom-right',
						direction: 'column',
						justify: false,
						translateX: 100,
						translateY: 0,
						itemsSpacing: 0,
						itemDirection: 'left-to-right',
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 12,
						symbolShape: 'circle',
						symbolBorderColor: 'rgba(0, 0, 0, .5)',
						effects: [
							{
								on: 'hover',
								style: {
									itemBackground: 'rgba(0, 0, 0, .03)',
									itemOpacity: 1
								}
							}
						]
					}
				] : null}
			/>
			<style jsx>
				{`
					.line {
						height: 40vh;
						width: 40vw;
						background: white;
						transition: 0.3s;
					}

					.line:hover {
						box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
					}
				`}
			</style>
		</div>
	);
};
