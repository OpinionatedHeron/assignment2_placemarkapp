import axios from "axios";
import type { Session, User } from "../types/location-types";
import type { Folder, Location } from "../types/location-types";
import { loggedInUser, currentLocations, currentFolders } from "$lib/runes.svelte";
import { computeByCategory, computeByFolder } from "./location-utils";

export const locationService = {
  baseUrl: "http://localhost:3000",

  saveSession(session: Session, email: string) {
    localStorage.location = JSON.stringify({
        email: email,
        name: session.name,
        token: session.token,
        _id: session._id
    });
  },

  async restoreSession() {
    const savedLoggedInUser = localStorage.location;
    if (savedLoggedInUser) {
        const session = JSON.parse(savedLoggedInUser);
        loggedInUser.email = session.email;
        loggedInUser.name = session.name;
        loggedInUser.token = session.token;
        locationService._id = session._id;
    }
    await this.refreshLocationInfo();
  },

  clearSession(){
    currentLocations.locations = [];
    currentFolders.folders = [];
    loggedInUser.email = "";
    loggedInUser.name = "";
    loggedInUser.token = "";
    loggedInUser._id = "";
    localStorage.removeItem("location");
  },

  async signup(user: User): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users`, user);
      return response.status === 201 && response.data._id;
    } catch (error) {
      console.error("Error during signup:", error);
      return false;
    }
  },

  async login(email: string, password: string): Promise<Session | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, {
        email,
        password
      });
      if (response.data.success && response.data.token) {
        axios.defaults.headers.common["Authorization"] = response.data.token;
        const session: Session = {
          name: response.data.name,
          token: response.data.token,
          _id: response.data._id
        };
        this.saveSession(session, email);
        await this.refreshLocationInfo();
        return session;
      }
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  },

  async createFolder(folder: { name: string }, token: string): Promise<Folder | null> {
    try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(`${this.baseUrl}/api/folders`, {title: folder.name});
        return response.status === 201 ? response.data : null;
    } catch (error) {
        console.error("Error creating folder:", error);
        return null;
    }
  },

  async getFolders (token: string): Promise<Folder[]> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${this.baseUrl}/api/folders`);
      const folders = response.data.folders || response.data || [];
      return folders.map((folder: any) => ({
        ...folder,
        name: folder.title || folder.name, // Ensure the name is set correctly
      }));
    } catch (error) {
      console.error("Error finding folders:", error);
      return [];
    }
  },

  async deleteFolder(folderId: string, token: string): Promise<boolean> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.delete(`${this.baseUrl}/api/folders/${folderId}`);
      return response.status === 204; // No Content status indicates successful deletion
    } catch (error) {
      console.error("Error deleting folder:", error);
      return false;
    }
  },

  async createLocation(folderId: string, location: Omit<Location, '_id' | 'folderid'>, token: string): Promise<Location | null> {
    try {
      axios.defaults.headers.common["Authorization"] = token;

      console.log("Creating location with folderId:", folderId, "and location data:", location);
      console.log("Token being used:", token);

      const response = await axios.post(`${this.baseUrl}/api/folders/${folderId}/locations`, location);
      await this.refreshLocationInfo();
      return response.status === 201 ? response.data : null;
    } catch (error) {
      console.error("Error creating location:", error);

      return null;
    }
  },

  async getLocations(token: string): Promise<Location[]> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${this.baseUrl}/api/locations`);
      return response.data || [];
    } catch (error) {
      console.error("Error finding locations:", error);
      return [];
    }
  },

  async getLocation(locationId: string, token: string): Promise<Location[]> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${this.baseUrl}/api/locations/${locationId}`);
      return response.data || [];
    } catch (error) {
      console.error("Error finding location:", error);
      return [];
    }
  },

  async deleteLocation(locationId: string, token: string): Promise<boolean> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.delete(`${this.baseUrl}/api/locations/${locationId}`);
      return response.status === 204; // No Content status indicates successful deletion
    } catch (error) {
      console.error("Error deleting location:", error);
      return false;
    }
  },

  async refreshLocationInfo() {
    if (loggedInUser.token) {
      currentLocations.locations = await this.getLocations(loggedInUser.token);
      currentFolders.folders = await this.getFolders(loggedInUser.token);
      computeByCategory(currentLocations.locations);
      computeByFolder(currentLocations.locations, currentFolders.folders);
    }
  }
};
