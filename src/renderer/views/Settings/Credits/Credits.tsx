import React from 'react';
import classnames from 'classnames/bind';

import Icon from 'renderer/components/Icon';
import styles from './Credits.module.scss';
import cassetteImg from '../../../assets/cassette.png';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  Credits page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Credits: React.FC<Props> = ({ className }) => {
  return (
    <div className={cx('base', className)}>
      <div className={cx('header')}>
        <img className={cx('image')} src={cassetteImg} alt="Thanks" />
        <div className={cx('introduction')}>
          <p>
            MIDI Jar is developed by{' '}
            <a href="https://ljas.fr" target="_blank" rel="noreferrer">
              Rémi Jarasson (La Jarre à Son)
            </a>
            , and is available for free. It is based on multiple amazing
            open-source projects and resources that deserve special mentions:
          </p>
        </div>
      </div>

      <table className={cx('table')}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tonal</td>
            <td>
              A functional music theory library for Javascript, that enabled
              MIDI Jar to detect chords, and handle MIDI notes easily
            </td>
            <td>
              <a
                href="https://github.com/tonaljs/tonal"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" /> Github
              </a>{' '}
              -{' '}
              <a
                href="https://github.com/tonaljs/tonal/issues"
                target="_blank"
                rel="noreferrer"
              >
                Report issues
              </a>
            </td>
          </tr>
          <tr>
            <td>VexFlow</td>
            <td>
              A JavaScript library for rendering music notation and guitar
              tablature.
            </td>
            <td>
              <a
                href="https://github.com/0xfe/vexflow"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" /> Github
              </a>
            </td>
          </tr>
          <tr>
            <td>@julusian/midi</td>
            <td>
              A node.js wrapper for the RtMidi C++ library that provides
              realtime MIDI I/O. Forked from @justinlatimer/node-midi.
            </td>
            <td>
              <a
                href="https://github.com/Julusian/node-midi"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" /> Github
              </a>
            </td>
          </tr>
          <tr>
            <td>React Flow</td>
            <td>
              Highly customizable library for building interactive node-based
              UIs, editors, flow charts and diagrams. It allows MIDI Jar to have
              understandable MIDI routing with nodes and draggable edges.
            </td>
            <td>
              <a
                href="https://github.com/wbkd/react-flow"
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="github" /> Github
              </a>
            </td>
          </tr>
          <tr>
            <td>React Electron Boilerplate</td>
            <td>
              A Foundation for Scalable Cross-Platform Apps in Electron, the
              base boilerplate for MIDI Jar.
            </td>
            <td>
              <a
                href="https://github.com/electron-react-boilerplate/electron-react-boilerplate"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
            </td>
          </tr>
          <tr>
            <td>Flaticon</td>
            <td>
              Most MIDI Jar icons are based on the Flaticon&apos;s
              &lt;uicons&gt; icon pack.
            </td>
            <td>
              <a
                href="https://www.flaticon.com/uicons"
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Credits.defaultProps = defaultProps;

export default Credits;
