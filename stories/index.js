import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, boolean, text } from '@storybook/addon-knobs/react';
import DateRangePicker from '../src/index.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

class DateRangeWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null
    };
    this.handleSet = this.handleSet.bind(this);
  }

  handleSet(startDate, endDate) {
    console.log(startDate, endDate);
    this.setState({ startDate, endDate });
  }
  render() {
    return (
      <DateRangePicker
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        handleSet={this.handleSet}
        autoUpdateInput={false}
        locale={{ format: 'MM/DD/YYYY' }}
      />
    );
  }
}
storiesOf('DateRangePicker', module)
  .addDecorator((story, context) => withInfo()(story)(context))
  .addDecorator(story => <div style={{ margin: 40 }}>{story()}</div>)
  .addDecorator(withKnobs)
  .add('simple', () => {
    const buttonLabel = text('label', 'click to open');
    return (
      <DateRangePicker>
        <button>{buttonLabel}</button>
      </DateRangePicker>
    );
  })
  .add('with start and end date', () => {
    const buttonLabel = text('label', 'click to open');
    const startDate = text('startDate', '1/1/2017');
    const endDate = text('endDate', '1/5/2017');
    return (
      <DateRangePicker startDate={startDate} endDate={endDate}>
        <button>{buttonLabel}</button>
      </DateRangePicker>
    );
  })
  .add('with input', () => {
    return <DateRangeWrapper />;
  })
  .add('log events', () => {
    const buttonLabel = text('label', 'click to open');
    return (
      <DateRangePicker
        onApply={action('onApply')}
        onCancel={action('onCancel')}
        onEvent={action('onEvent')}
        onHide={action('onHide')}
        onHideCalendar={action('onHideCalendar')}
        onShow={action('onShow')}
        onShowCalendar={action('onShowCalendar')}
      >
        <button>{buttonLabel}</button>
      </DateRangePicker>
    );
  })
  .add('showDropdowns', () => {
    const buttonLabel = text('label', 'click to open');
    const showDropdowns = boolean('showDropdowns', true);
    return (
      <DateRangePicker showDropdowns={showDropdowns}>
        {' '}
        <button>{buttonLabel}</button>
      </DateRangePicker>
    );
  });
