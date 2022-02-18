import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faFilePdf,
  faBars,
  faAngleRight,
  faCheck,
  faTimes,
  faPlus,
  faGlobe,
  faMapMarkerAlt,
  faClock,
  faPhone,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';

library.add(
  faFilePdf,
  faBars,
  faAngleRight,
  faCheck,
  faTimes,
  faPlus,
  faGlobe,
  faMapMarkerAlt,
  faClock,
  faPhone,
  faEnvelope,
);
library.add(faLinkedinIn, faGithub);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch();
