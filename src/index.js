'use strict';
import React, { Component } from 'react';
import $ from 'jquery';
import getOptions from './get-options.js';
import PropTypes from 'prop-types';
import 'bootstrap-daterangepicker';

export class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '', isTyped: false };
    this.$picker = null;
    this.options = getOptions();
    this.handleInput = this.handleInput.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }
  makeEventHandler(eventType) {
    const { onEvent } = this.props;
    return (event, picker) => {
      if (typeof onEvent === 'function') {
        onEvent(event, picker);
      }
      if (typeof this.props[eventType] === 'function') {
        this.props[eventType](event, picker);
      }
      if (!this.props.children && eventType === 'onApply') {
        if (typeof this.props.handleSet === 'function') {
          this.props.handleSet(
            picker.startDate.format(this.props.locale.format),
            picker.endDate.format(this.props.locale.format)
          );
        }
      }
    };
  }
  getOptionsFromProps(props) {
    var options;
    props = props || this.props;
    this.options.forEach(option => {
      if (props.hasOwnProperty(option) && props[option] !== null) {
        options = options || {};
        options[option] = props[option];
      }
    });
    return options || {};
  }
  setOptionsFromProps(currentOptions) {
    var keys = Object.keys(currentOptions);
    if (this.$picker) {
      if (currentOptions) {
        keys.forEach(key => {
          if (key === 'startDate' && currentOptions[key] !== null) {
            this.$picker
              .data('daterangepicker')
              .setStartDate(currentOptions[key]);
          } else if (key === 'endDate' && currentOptions[key] !== null) {
            this.$picker
              .data('daterangepicker')
              .setEndDate(currentOptions[key]);
          } else if (key === 'locale') {
            $.extend(
              this.$picker.data('daterangepicker')[key],
              currentOptions[key]
            );
          } else {
            this.$picker.data('daterangepicker')[key] = currentOptions[key];
          }
        });
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.startDate !== this.props.startDate ||
      prevProps.endDate !== this.props.endDate
    ) {
      if (!this.props.startDate) {
        this.setState({ inputValue: '' });
      }
      if (
        (this.props.startDate && !this.props.endDate) ||
        this.props.startDate === this.props.endDate
      ) {
        this.setState({ inputValue: this.props.startDate });
      } else {
        this.setState({
          inputValue: `${this.props.startDate} - ${this.props.endDate}`
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.$picker) {
      var currentOptions = this.getOptionsFromProps();
      var nextOptions = this.getOptionsFromProps(nextProps);
      var changedOptions = {};
      this.options.forEach(option => {
        if (currentOptions[option] !== nextOptions[option]) {
          changedOptions[option] = nextOptions[option];
        }
      });
      this.setOptionsFromProps(changedOptions);
    }
  }
  componentDidMount() {
    this.initializeDateRangePicker();
  }
  componentWillUnmount() {
    this.removeDateRangePicker();
  }
  removeDateRangePicker() {
    if (this.$picker && this.$picker.data('daterangepicker')) {
      this.$picker.data('daterangepicker').remove();
    }
  }
  initializeDateRangePicker() {
    // initialize
    this.$picker.daterangepicker(this.getOptionsFromProps());
    // attach event listeners
    ['Show', 'Hide', 'ShowCalendar', 'HideCalendar', 'Apply', 'Cancel'].forEach(
      event => {
        var lcase = event.toLowerCase();
        this.$picker.on(
          lcase + '.daterangepicker',
          this.makeEventHandler('on' + event)
        );
      }
    );
  }
  handleInput(evt) {
    this.setState({ inputValue: evt.target.value });
  }
  handleKeypress(evt) {
    if (evt.charCode === 13) {
      this.props.handleSet(
        this.$picker
          .data('daterangepicker')
          .startDate.format(this.props.locale.format),
        this.$picker
          .data('daterangepicker')
          .endDate.format(this.props.locale.format)
      );
    } else {
      this.setState({ isTyped: evt.target.value.length > 0 });
    }
  }
  handleBlur(evt) {
    if (this.state.isTyped) {
      this.props.handleSet(
        this.$picker
          .data('daterangepicker')
          .startDate.format(this.props.locale.format),
        this.$picker
          .data('daterangepicker')
          .endDate.format(this.props.locale.format)
      );
    }
  }
  render() {
    const { containerStyles, containerClass, children } = this.props;
    if (children) {
      return (
        <div
          ref={picker => {
            this.$picker = $(picker);
          }}
          className={containerClass}
          style={containerStyles}
        >
          {children}
        </div>
      );
    } else {
      return (
        <input
          ref={picker => {
            this.$picker = $(picker);
          }}
          className={containerClass}
          style={containerStyles}
          value={this.state.inputValue}
          onChange={this.handleInput}
          onKeyPress={this.handleKeypress}
          onBlur={this.handleBlur}
          placeholder={`${this.props.locale.format.toLowerCase()} - ${this.props.locale.format.toLowerCase()}`}
        />
      );
    }
  }
}

DateRangePicker.defaultProps = {
  containerClass: 'react-bootstrap-daterangepicker-container',
  containerStyles: {
    display: 'inline-block'
  }
};

DateRangePicker.propTypes = {
  '<input>': PropTypes.any,
  alwaysShowCalendars: PropTypes.bool,
  applyClass: PropTypes.string,
  autoApply: PropTypes.bool,
  autoUpdateInput: PropTypes.bool,
  buttonClasses: PropTypes.array,
  cancelClass: PropTypes.string,
  containerClass: PropTypes.string,
  containerStyles: PropTypes.object,
  dateLimit: PropTypes.object,
  drops: PropTypes.oneOf(['down', 'up']),
  endDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isCustomDate: PropTypes.func,
  isInvalidDate: PropTypes.func,
  linkedCalendars: PropTypes.bool,
  locale: PropTypes.object,
  maxDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  minDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onEvent: PropTypes.func,
  onHide: PropTypes.func,
  onHideCalendar: PropTypes.func,
  onShow: PropTypes.func,
  onShowCalendar: PropTypes.func,
  opens: PropTypes.oneOf(['left', 'right', 'center']),
  parentEl: PropTypes.any,
  ranges: PropTypes.object,
  showCustomRangeLabel: PropTypes.bool,
  showDropdowns: PropTypes.bool,
  showISOWeekNumbers: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  singleDatePicker: PropTypes.bool,
  startDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  template: PropTypes.any,
  timePicker: PropTypes.bool,
  timePickerIncrement: PropTypes.number,
  timePicker24Hour: PropTypes.bool,
  timePickerSeconds: PropTypes.bool
};

export default DateRangePicker;
