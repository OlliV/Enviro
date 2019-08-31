import { ResponsiveLine } from '@nivo/line';
import data from '../data';

export default () => {
	return (
        <div className="line">
			<ResponsiveLine
				data={data}
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
				xScale={{ type: 'point' }}
				yScale={{ type: 'linear', stacked: true, min: 'auto', max: 'auto' }}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					orient: 'bottom',
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'time',
					legendOffset: 36,
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
				useMesh={true}
				legends={[
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
				]}
			/>
            <style jsx>{
                `
               .line {
                    height:50vh;
                    width:60vw;
                    background: white;
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                    transition: 0.3s;
                }

                .line:hover {
                     box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                }
                `
            }
            </style>
        </div>
    );
}
