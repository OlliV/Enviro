import { ResponsiveLine } from '@nivo/line';

export default ({series, title}) => {
	return (
		<div className="line-container">
            <div className="line">
            <b>{title}</b>
			<ResponsiveLine
				data={series}
				margin={{ top: 10, right: series.length > 1 ? 110 : 60, bottom: 100, left: 60 }}
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
					legendOffset: 65,
					legendPosition: 'middle'
				}}
				axisLeft={{
					orient: 'left',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'value',
					legendOffset: -55,
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
                theme={{
                    textColor: '#e1e1e1',
                }}
				legends={series.length > 1 ? [
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
				] : undefined}
			/>
            </div>
			<style jsx>
				{`
					.line-container {
                        display: flex;
						height: 40vh;
						width: 30vw;
						background: white;
						transition: 0.3s;
                        text-align: center;
                        background-color: #1e1e1e;
                        margin: 3pt;
                        color: #e1e1e1;
                        border-radius: 5pt;
					}
					.line-container:hover {
						box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
					}
                    .line {
                        width: 100%;
                    }
				`}
			</style>
		</div>
	);
};
