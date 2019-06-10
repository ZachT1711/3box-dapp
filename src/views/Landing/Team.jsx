import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ProfileHover from 'profile-hover';
import Box from '3box';

import ColorCubes from '../../assets/ColorCubes.svg';
import ColorCubesMobile from '../../assets/ColorCubesMobile.svg';
import '../styles/Landing.css';
import '../styles/NewLanding.css';
import '../../components/styles/Nav.css';
import DiscordButton from './components/DiscordButton';
import Footer from './components/Footer';

const styles = {
  backgroundImage: `url("${ColorCubes}")`,
  backgroundRepeat: 'absolute',
};

const graphqlQueryObject = address => `
{
  profile(id: "${address}") {
    name
    image
  }
}
`;

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      danny: {},
      oed: {},
      zach: {},
      michael: {},
      kenzo: {},
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    try {
      const profileCalls = [];
      profileCalls.push(Box.profileGraphQL(graphqlQueryObject('0xBcfD8dDAc6B8fe5144553B50790ca631b1760FB0'))); // danny
      profileCalls.push(Box.profileGraphQL(graphqlQueryObject('0x5c44e8982fa3c3239c6e3c5be2cc6663c7c9387e'))); // oed
      profileCalls.push(Box.profileGraphQL(graphqlQueryObject('0x9acb0539f2ea0c258ac43620dd03ef01f676a69b'))); // zach
      profileCalls.push(Box.profileGraphQL(graphqlQueryObject('0xa8ee0babe72cd9a80ae45dd74cd3eae7a82fd5d1'))); // michael
      profileCalls.push(Box.profileGraphQL(graphqlQueryObject('0x59B5fbC62519DBF9B7044fd0eCb6442aC16FAe2A'))); // kenzo

      const profilePromises = Promise.all(profileCalls);
      const profiles = await profilePromises;

      this.setState({
        danny: profiles[0],
        oed: profiles[1],
        zach: profiles[2],
        michael: profiles[3],
        kenzo: profiles[4],
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      danny, oed, zach, michael, kenzo,
    } = this.state;

    return (
      <div className="landing_page">
        <main className="hero partners_hero">
          <div className="partners_content">
            <div className="partners_content_wrapper">
              <div className="partners_content_header">
                <h4 className="highlight_header">TEAM</h4>
              </div>
              <div className="team_mates_wrapper">
                <div className="team_mates">
                  {/* Danny */}
                  {danny.profile && (
                    <ProfileHover
                      address="0xBcfD8dDAc6B8fe5144553B50790ca631b1760FB0"
                      noTheme
                      orientation="right"
                    >
                      <div className="team_tile">
                        <img src={`https://ipfs.infura.io/ipfs/${danny.profile.image}`} alt="profile" />
                        <div className="team_info">
                          <h3>{danny.profile.name}</h3>
                          <p>Co-founder, Operations</p>
                        </div>
                      </div>
                    </ProfileHover>
                  )}

                  {/* oed */}
                  {oed.profile && (
                    <ProfileHover
                      address="0x5c44e8982fa3c3239c6e3c5be2cc6663c7c9387e"
                      noTheme
                      orientation="right"
                    >
                      <div className="team_tile">
                        <img src={`https://ipfs.infura.io/ipfs/${oed.profile.image}`} alt="profile" />
                        <div className="team_info">
                          <h3>{oed.profile.name}</h3>
                          <p>Co-founder, Engineering</p>
                        </div>
                      </div>
                    </ProfileHover>
                  )}

                  {/* Michael */}
                  {michael.profile && (
                    <ProfileHover
                      address="0xa8ee0babe72cd9a80ae45dd74cd3eae7a82fd5d1"
                      noTheme
                      orientation="right"
                    >
                      <div className="team_tile">
                        <img src={`https://ipfs.infura.io/ipfs/${michael.profile.image}`} alt="profile" />
                        <div className="team_info">
                          <h3>{michael.profile.name}</h3>
                          <p>Co-founder, Product</p>
                        </div>
                      </div>
                    </ProfileHover>
                  )}

                  {/* Zach */}
                  {zach.profile && (
                    <ProfileHover
                      address="0x9acb0539f2ea0c258ac43620dd03ef01f676a69b"
                      noTheme
                      orientation="right"
                    >
                      <div className="team_tile">
                        <img src={`https://ipfs.infura.io/ipfs/${zach.profile.image}`} alt="profile" />
                        <div className="team_info">
                          <h3>{zach.profile.name}</h3>
                          <p>Fullstack Engineer</p>
                        </div>
                      </div>
                    </ProfileHover>
                  )}

                  {/* Kenzo */}
                  {kenzo.profile && (
                    <ProfileHover
                      address="0x59B5fbC62519DBF9B7044fd0eCb6442aC16FAe2A"
                      noTheme
                      orientation="right"
                    >
                      <div className="team_tile">
                        <img src={`https://ipfs.infura.io/ipfs/${kenzo.profile.image}`} alt="profile" />
                        <div className="team_info">
                          <h3>{kenzo.profile.name}</h3>
                          <p>Front-End Engineer</p>
                        </div>
                      </div>
                    </ProfileHover>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="hero_graphic">
            <div style={styles} className="hero_graphic_colorcubes-dtw" />
            <img src={ColorCubesMobile} alt="Color cubes" className="hero_graphic_colorcubes-mobile" />
          </div>
          <DiscordButton />
        </main>

        <Footer />
      </div>
    );
  }
}

Team.propTypes = {
  handleSignInUp: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
};

Team.defaultProps = {
  isLoggedIn: false,
};

const mapState = state => ({
  isLoggedIn: state.userState.isLoggedIn,
});

export default withRouter(connect(mapState)(Team));