import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment-timezone';

Enzyme.configure({ adapter: new Adapter() });

jest.doMock('moment', () => {
  moment.tz.setDefault('America/New_York');
  return moment;
});
