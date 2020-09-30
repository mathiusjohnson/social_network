import React from "react";
import { Link } from "gatsby";
import styled, { DefaultTheme } from "styled-components";
import Select from "@paljs/ui/Select";
import { LayoutHeader } from "@paljs/ui/Layout";
import { EvaIcon } from "@paljs/ui/Icon";
import { Actions } from "@paljs/ui/Actions";
import ContextMenu from "@paljs/ui/ContextMenu";
import { getPathReady } from "./Sidebar";
import { Location } from "@reach/router";
import { breakpointDown } from "@paljs/ui/breakpoints";
import LoginLogout from "../components/LoginLogout/LoginLogout";

const HeaderStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${breakpointDown("sm")`
    .right{
      display: none;
    }
  `}
  .right > div {
    height: auto;
    display: flex;
    align-content: center;
  }
  .logo {
    font-size: 1.25rem;
    white-space: nowrap;
    text-decoration: none;
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const SelectStyled = styled(Select)`
  min-width: 150px;
`;

interface HeaderProps {
  toggleSidebar: () => void;
  changeTheme: (value: DefaultTheme["name"]) => void;
  changeDir: () => void;
  dir: "rtl" | "ltr";
}

const Header: React.FC<HeaderProps> = (props) => {
  const themeOptions = [
    {
      value: "default",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#a6c1ff" }} />
          Default
        </Label>
      ),
    },
    {
      value: "dark",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#192038" }} />
          Dark
        </Label>
      ),
    },
    {
      value: "cosmic",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#5a37b8" }} />
          Cosmic
        </Label>
      ),
    },
    {
      value: "corporate",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#3366ff" }} />
          Corporate
        </Label>
      ),
      selected: true,
    },
  ];
  return (
    <LayoutHeader fixed>
      <HeaderStyle>
        <Actions
          size="Medium"
          actions={[
            {
              icon: { name: "menu-2-outline" },
              url: {
                onClick: props.toggleSidebar,
              },
            },
            {
              content: (
                <Link to="/" className="logo">
                  STACK
                </Link>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              icon: { name: "message-square-outline" },
              link: { to: "/messages" },
            },
            {
              content: (
                // <Location>
                //   {({ location }) => (
                //     <ContextMenu
                //       style={{ cursor: "pointer" }}
                //       placement="bottom"
                //       currentPath={getPathReady(location.pathname)}
                //       items={[
                //         { title: "Profile", link: { to: "/user-profile" } },
                //         { title: "Log out", link: { to: "/logout" } },
                //       ]}
                //       Link={Link}
                //     >
                  <LoginLogout/>                
                    // </ContextMenu>
                  // )}
                // </Location>
              ),
            },
          ]}
        />
      </HeaderStyle>
    </LayoutHeader>
  );
};
export default Header;
